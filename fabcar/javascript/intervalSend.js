/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const protobuf = require('protobufjs');
const fs = require('fs');
const path = require('path');

const AwesomeMessage =
new protobuf.Type("BlockchainInfo")
    .add(new protobuf.Field("height", 1, "uint32"))
    .add(new protobuf.Field("currentBlockHash", 2, "bytes"))
    .add(new protobuf.Field("previousBlockHash", 3, "bytes"));

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'crypto-config', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('user1');
        if (!identity) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const channelName = 'mychannel';
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract('empty');
        const contractQscc = network.getContract('qscc');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        
        const txCnt = 3000;
        const intervalCnt = 300;
        const intervalMs = 1000;
        let txInd = 0;


        let arr_Ts = new Array(txCnt);

        let recvCnt = 0;

        const sendTx = async (txCnt2Send) => {
            for(let ind = 0; ind < txCnt2Send; ind++)
            {
                
                new Promise(async (resolve, reject)=>{
                    let mInd = txInd;

                    let tsSend = new Date();
                    await contract.submitTransaction('query');
                    let tsRecv = new Date();
                    arr_Ts[mInd] = [tsSend.getTime(), tsRecv.getTime()];
                    
                    
                    resolve([mInd]);

                }).then(async ([index])=>{
                    if(index % 100 == 0)
                    {
                        console.log(index);
                    }
                    recvCnt++;
                    if(recvCnt >= txCnt)
                    {
                        

                        {
                            const result = await contractQscc.evaluateTransaction('GetChainInfo', channelName);                                                        
                            let message = AwesomeMessage.decode(result);
                            let edBlockNumber = message.height;

                            fs.writeFileSync(path.resolve(__dirname, 'rec', 'blockNumber.json'), JSON.stringify({
                                stBlockNumber: stBlockNumber,
                                edBlockNumber: edBlockNumber
                            }));
                            
                            // var root = new Root().define("pkg").add(AwesomeMessage);
                        }
                        
                        await gateway.disconnect();
                        fs.writeFileSync(path.resolve(__dirname, 'rec', 'arr_Ts.json'), JSON.stringify(arr_Ts));
                    }
                });
                txInd++;
            }
            if(txInd >= txCnt)
            {
                clearInterval(intervalID);
            }
        }
        
        var stBlockNumber = -1;
        {
            const result = await contractQscc.evaluateTransaction('GetChainInfo', channelName);                                                        
            let message = AwesomeMessage.decode(result);
            stBlockNumber = message.height;
        }
        var intervalID = setInterval(()=>{sendTx(intervalCnt)}, intervalMs);

        // console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();

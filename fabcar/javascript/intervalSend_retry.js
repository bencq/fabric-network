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
const {txCnt, intervalCnt, intervalMs, fixedCnt} = require('./config');
const maxRetry = 2;
const retryDelay = 1000;
const { ccpPath } = require('./common');

const AwesomeMessage =
new protobuf.Type("BlockchainInfo")
    .add(new protobuf.Field("height", 1, "uint32"))
    .add(new protobuf.Field("currentBlockHash", 2, "bytes"))
    .add(new protobuf.Field("previousBlockHash", 3, "bytes"));

function rejectDelay(reason) {
    return new Promise(function(resolve, reject) {
        console.log('t')
        setTimeout(reject.bind(reason, null), retryDelay); 
    });
}

async function main() {
    try {
        // load the network configuration
        
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
        const contract = network.getContract('putstate');
        const contractQscc = network.getContract('qscc');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        
        let txInd = 0;


        let arr_Ts = [];

        let recvCnt = 0;

        const sendTx = async (txCnt2Send) => {
            for(let ind = 0; ind < txCnt2Send; ind++)
            {
                
                new Promise(async (resolve, reject)=>{
                    let mInd = txInd;

                    let tsSend = new Date();
                    // await contract.submitTransaction('create');

                    var p = contract.submitTransaction('create', mInd.toString());
                    // for(let rInd = 0; rInd < maxRetry; rInd++)
                    // {
                    //     p = p.catch(rejectDelay);
                    // }
                    p = p.then((ret)=>
                    {
                        let tsRecv = new Date();
                        arr_Ts.push([tsSend.getTime(), tsRecv.getTime()]);
                        resolve([mInd]);
                    }).catch(()=>{console.log('err');});

                    
                    

                }).then(async ([index])=>{
                    if(index % 100 == 0)
                    {
                        console.log(index);
                    }
                    recvCnt++;
                    if(recvCnt >= txCnt)
                    {
                        clearInterval(intervalID);
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

                
        }
        
        var stBlockNumber = -1;
        {
            const result = await contractQscc.evaluateTransaction('GetChainInfo', channelName);                                                        
            let message = AwesomeMessage.decode(result);
            stBlockNumber = message.height;
        }
        var intervalID = setInterval(()=>{
            let restTxCnt = txCnt - recvCnt;
            let txCnt2Send = Math.min(restTxCnt, intervalCnt);
            sendTx(txCnt2Send);
        }, intervalMs);
        // console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();

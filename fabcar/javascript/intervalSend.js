/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

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
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: false, asLocalhost: false } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('empty');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        
        const txCnt = 1000;
        let txInd = 0;
        let recvCnt = 0;

        const sendTx = async (txCnt2Send) => {
            for(let ind = 0; ind < txCnt2Send; ind++)
            {
                txInd++;
                new Promise(async (resolve, reject)=>{
                    let mInd = txInd;
                    await contract.submitTransaction('query');
                    
                    resolve(mInd);
                }).then(async (index)=>{
                    console.log(index);
                    recvCnt++;
                    if(recvCnt >= txCnt)
                    {
                        await gateway.disconnect();
                    }
                });
                
            }
            if(txInd >= txCnt)
            {
                clearInterval(intervalID);
            }
        }
        
        var intervalID = setInterval(()=>{sendTx(100)}, 1000);

        // console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();

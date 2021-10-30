/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const fn = require('fabric-network');
const { Gateway, Wallets } = fn;
const protobuf = require('protobufjs')
// const { BlockDecoder } = require('fabric-common')
const path = require('path');
const fs = require('fs');


async function main() {
    try {
        // load the network configuration
        
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

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
        const contract = network.getContract('qscc');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction('GetChainInfo', channelName);

        {
            var Root = protobuf.Root,
                Type = protobuf.Type,
                Field = protobuf.Field;
            
            var AwesomeMessage = new Type("BlockchainInfo")
                                        .add(new Field("height", 1, "uint32"))
                                        .add(new Field("currentBlockHash", 2, "bytes"))
                                        .add(new Field("previousBlockHash", 3, "bytes"));
                                        
            var message = AwesomeMessage.decode(result);
            
            // var root = new Root().define("pkg").add(AwesomeMessage);
        }
        
        // const resultJson = BlockDecoder.decode(result)
        
        console.log(`Transaction has been evaluated, result is: ${result}`);

        // Disconnect from the gateway.
        await gateway.disconnect();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();

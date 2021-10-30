/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class PutState extends Contract {

    async initLedger(ctx) {
        // console.info('============= END : Initialize Ledger ===========');
    }

    async query(ctx, key) {
        // console.info('============= END : Query ===========');
        const stateBuffer = await ctx.stub.getState(key);
        if (!stateBuffer || stateBuffer.length === 0) {
            return "";
        } else {
            return stateBuffer.toString();
        }
    }

    async create(ctx, key) {
        
        await ctx.stub.putState(key, Buffer.from(key));
        // console.info('============= END : Create ===========');
    }

}

module.exports = PutState;


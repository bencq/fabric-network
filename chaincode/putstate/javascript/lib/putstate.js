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

    async query(ctx) {
        // console.info('============= END : Query ===========');
        let ts = new Date().getTime().toString();
        const stateBuffer = await ctx.stub.getState(ts);
        // if (!stateBuffer || stateBuffer.length === 0) {
            
        // } else {
            
        // }
    }

    async create(ctx) {
        let ts = new Date().getTime().toString();
        ctx.stub.putState(ts, Buffer.from(ts));
        // console.info('============= END : Create ===========');
    }

}

module.exports = PutState;

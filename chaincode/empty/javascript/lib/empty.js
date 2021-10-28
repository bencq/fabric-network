/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Empty extends Contract {

    async initLedger(ctx) {
        // console.info('============= END : Initialize Ledger ===========');
    }

    async query(ctx) {
        // console.info('============= END : Query ===========');
    }

    async create(ctx) {
        // console.info('============= END : Create ===========');
    }

}

module.exports = Empty;

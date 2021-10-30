const fs = require('fs');
const path = require('path');
const {txCnt, intervalCnt, intervalMs, fixedCnt} = require('./config');

let arr_Ts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'rec', 'arr_Ts.json')));
let {stBlockNumber, edBlockNumber} = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'rec', 'blockNumber.json')));


let delayMses = new Array(txCnt);
let minTs = Infinity;
let maxTs = -Infinity;
for(let ind = 0; ind < txCnt; ind++)
{
    minTs = Math.min(minTs, arr_Ts[ind][0], arr_Ts[ind][1]);
    maxTs = Math.max(maxTs, arr_Ts[ind][0], arr_Ts[ind][1]);
    delayMses[ind] = arr_Ts[ind][1] - arr_Ts[ind][0];
}
let totTimeSpent = maxTs - minTs;
let minDelay = Math.min(...delayMses)
let maxDelay = Math.max(...delayMses)
let sumDelay = delayMses.reduce((pV, cV, cI, arr)=>{
    return pV + cV;
}, 0);
let avgDelay = sumDelay / txCnt;
let tps = txCnt / (totTimeSpent / 1000);

let avgTxCntPerBlock = txCnt / (edBlockNumber - stBlockNumber);

let object_writeOut = {
    txCnt: txCnt,
    intervalCnt: intervalCnt,
    intervalMs: intervalMs,
    fixedCnt: fixedCnt,
    
    totTimeSpent: totTimeSpent,
    tps: tps,

    minDelay: minDelay,
    maxDelay: maxDelay,
    avgDelay: avgDelay,

    stBlockNumber: stBlockNumber,
    edBlockNumber: edBlockNumber,

    avgTxCntPerBlock: avgTxCntPerBlock,
    
    

}


fs.writeFileSync(path.resolve(__dirname, 'rec', 'statistic.json'), JSON.stringify(object_writeOut));



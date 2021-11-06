const fs = require('fs');
const path = require('path');
const {txCnt, intervalCnt, intervalMs, fixedCnt} = require('./config');

let arr_Ts = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'rec', 'arr_Ts.json')));
let {stBlockNumber, edBlockNumber} = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'rec', 'blockNumber.json')));

const arrTsLen = arr_Ts.length

let delayMses = [];
let minTs = Infinity;
let maxTs = -Infinity;

let nullArr = [];

for(let ind = 0; ind < arrTsLen; ind++)
{
    if(!arr_Ts[ind] || !arr_Ts[ind][0] || !arr_Ts[ind][1])
    {
        nullArr.push([ind, arr_Ts[ind]]);
    }
    else
    {
        minTs = Math.min(minTs, arr_Ts[ind][0], arr_Ts[ind][1]);
        maxTs = Math.max(maxTs, arr_Ts[ind][0], arr_Ts[ind][1]);
        delayMses.push(arr_Ts[ind][1] - arr_Ts[ind][0]);
    }


}
console.log(nullArr);
const nullCnt = nullArr.length;
const effectiveCnt = arrTsLen - nullCnt;
let totTimeSpent = maxTs - minTs;
let minDelay = delayMses.reduce((pV, cV, cI, arr)=>{
    return Math.min(pV, cV);
}, Infinity);
let maxDelay = delayMses.reduce((pV, cV, cI, arr)=>{
    return Math.max(pV, cV);
}, -Infinity);
let sumDelay = delayMses.reduce((pV, cV, cI, arr)=>{
    return pV + cV;
}, 0);
let avgDelay = sumDelay / effectiveCnt;
let tps = effectiveCnt / (totTimeSpent / 1000);

let avgTxCntPerBlock = effectiveCnt / (edBlockNumber - stBlockNumber);

let object_writeOut = {
    txCnt: txCnt,
    arrTsLen: arrTsLen,
    nullCnt: nullCnt,
    effectiveCnt: effectiveCnt,

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



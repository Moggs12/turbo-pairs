import {test} from 'node:test';
import assert from 'node:assert/strict';
import {trophyProgress} from '../src/trophies.js';
import {applyResult} from '../src/engine.js';
const game={id:'race',status:'complete',mode:'solo',difficultyId:'hard',players:[{id:'racer-1',name:'Kaiden'}],scores:[8]};
test('difficulty completion awards once, preserves legacy wins and never mutates prior records',()=>{
 const old={completed:[],players:{'racer-1':{name:'Kaiden',wins:4,gamesPlayed:4,pairsCollected:12,draws:0,losses:0}}};
 const next=applyResult(old,game);
 assert.equal(next.players['racer-1'].difficulties.hard,1);assert.equal(next.players['racer-1'].wins,5);
 assert.equal(old.players['racer-1'].difficulties,undefined);assert.equal(applyResult(next,game),next);
 const cups=trophyProgress([next],'racer-1');assert.equal(cups.filter(c=>c.earned).length,3);
 assert.equal(cups.find(c=>c.id==='easy').earned,false);
});
test('cabinet totals combine modes but isolate racers, exclude bot wins and do not invent old difficulties',()=>{
 const cups=trophyProgress([{players:{a:{wins:4},computer:{wins:30}}},{players:{a:{wins:6,difficulties:{easy:2,medium:1}},b:{wins:30}}}],'a');
 assert.equal(cups.find(c=>c.id==='ten-wins').earned,true);assert.equal(cups.find(c=>c.id==='hard').earned,false);
 assert.equal(cups.find(c=>c.id==='easy').earned,true);assert.equal(trophyProgress([],'a').filter(c=>c.earned).length,0);
});
test('draws and losses earn difficulty completion but no win trophies',()=>{
 const g={...game,mode:'two',players:[{id:'a',name:'A'},{id:'b',name:'B'}],scores:[4,4]};
 const r=applyResult({completed:[],players:{}},g);
 for(const id of ['a','b']){const cups=trophyProgress([r],id);assert.equal(cups.find(c=>c.id==='first-win').earned,false);assert.equal(cups.find(c=>c.id==='hard').earned,true);}
});

test('all cups repeat beyond the first award, with the next threshold advancing',()=>{
 const cups=trophyProgress([{players:{a:{wins:23,difficulties:{easy:8,medium:3,hard:2}}}}],'a');
 for(const [id,count,current,nextTarget] of [['first-win',23,23,24],['five-wins',4,23,25],['ten-wins',2,23,30],['easy',8,8,9],['medium',3,3,4],['hard',2,2,3]]){
  const cup=cups.find(c=>c.id===id);assert.equal(cup.earnedCount,count);assert.equal(cup.current,current);assert.equal(cup.nextTarget,nextTarget);assert.equal(cup.earned,true);
 }
 assert.equal(cups.reduce((total,c)=>total+c.earnedCount,0),42);
});
test('repeat counts do not increase just from reopening or recalculating a cabinet',()=>{
 const records={players:{a:{wins:10,difficulties:{easy:2}}}};
 assert.deepEqual(trophyProgress([records],'a'),trophyProgress([records],'a'));
 assert.equal(trophyProgress([records],'a').find(c=>c.id==='five-wins').earnedCount,2);
});

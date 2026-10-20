import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chooseAiCard,flip,settle} from '../src/engine.js';
const config=JSON.parse(readFileSync('src/config/game.json'));
const recall=config.difficulties.find(d=>d.id==='easy').computerMemoryRecall;
const remembered={deck:Array(6),memory:{0:'a',1:'a',2:'b',3:'b',4:'c',5:'c'},revealed:[0],matched:[]};
test('Easy can remember a pair or make a genuine guess, even with full memory',()=>{
 assert.ok(recall>0&&recall<1);
 assert.equal(chooseAiCard(remembered,()=>0,recall),1);
 const samples=[.9,.9];
 assert.equal(chooseAiCard(remembered,()=>samples.shift(),recall),5);
 assert.equal(chooseAiCard(remembered,()=>.9),1); // Other difficulties retain their behaviour.
});
test('Easy guesses never reveal an already matched or selected card or read hidden identities',()=>{
 const deck=new Proxy(Array(6),{get(target,key){if(/^\d+$/.test(String(key)))throw Error('Hidden identity accessed');return Reflect.get(target,key);}});
 const g={...remembered,deck,matched:['b']};
 for(const sample of [0,.2,.4,.6,.99]){
  const values=[.99,sample];
  assert.ok([1,4,5].includes(chooseAiCard(g,()=>values.shift(),recall)));
 }
});
function rng(seed){let s=seed>>>0;return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
function sweeps(memoryRecall){let count=0;for(let seed=1;seed<=2000;seed++){
 const random=rng(seed);
 let g={id:'trial',pairCount:3,mode:'ai',deck:['a','b','a','c','b','c'].map(id=>({id})),memory:{0:'a',1:'b'},revealed:[],matched:[],scores:[0,0],active:1,moves:1,status:'playing'};
 let steps=0;while(g.active===1&&g.status==='playing'&&steps++<30){
  g=flip(g,chooseAiCard(g,random,memoryRecall));
  if(g.revealed.length===2)g=settle(g);
 }
 assert.ok(steps<=30,'Computer turn must resolve');if(g.scores[1]===3)count++;
 }return count;}
test('Easy substantially reduces full-board sweeps after the human misses the first pair',()=>{
 const original=sweeps(1),gentler=sweeps(recall);
 assert.ok(original>0);
 assert.ok(gentler<original/2,`Original sweeps: ${original}; Easy sweeps: ${gentler}`);
 console.log(`Seeded first-miss trials: original ${original}/2000 full sweeps; Easy ${gentler}/2000.`);
});

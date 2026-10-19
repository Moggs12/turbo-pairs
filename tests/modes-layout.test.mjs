import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createGame,flip,settle,applyResult,validSession,chooseAiCard} from '../src/engine.js';
import {fitGrid} from '../src/layout.js';
const cards=Array.from({length:26},(_,i)=>({id:String(i),file:`${i}.png`}));
const players=[{id:'human',name:'Kaiden'},{id:'computer',name:'Turbo Bot'}];
test('solo mismatch keeps the same racer; completion and restoration support one player',()=>{
 let g=createGame(cards,{id:'easy',pairs:3},players.slice(0,1),'solo-test','solo');
 const other=g.deck.findIndex(c=>c.id!==g.deck[0].id);
 g=settle(flip(flip(g,0),other));assert.equal(g.active,0);assert.equal(g.moves,1);assert.ok(validSession(g,cards));
 for(const id of new Set(g.deck.map(c=>c.id))){const ix=g.deck.flatMap((c,i)=>c.id===id?[i]:[]);g=flip(flip(g,ix[0]),ix[1]);}
 assert.equal(g.status,'complete');assert.deepEqual(g.scores,[3]);assert.ok(validSession(g,cards));
 const r=applyResult({},g);assert.equal(r.players.human.wins,1);assert.equal(r.players.human.pairsCollected,3);assert.equal(applyResult(r,g),r);
});
test('computer uses revealed memories and never reads hidden deck identities',()=>{
 const deck=new Proxy(Array(6),{get(target,key){if(/^\d+$/.test(String(key)))throw Error('Hidden identity accessed');return Reflect.get(target,key);}});
 const game={deck,memory:{0:'a',3:'a',2:'b'},revealed:[],matched:[]};
 assert.equal(chooseAiCard(game,()=>0),0);
 assert.equal(chooseAiCard({...game,revealed:[0]},()=>0),3);
 assert.equal(chooseAiCard({...game,matched:['a']},()=>0),1);
});
for(const pairs of [3,6,8])test(`computer completes a ${pairs*2}-card game without stale or illegal moves`,()=>{
 let g=createGame(cards,{id:'test',pairs},players,'ai-test','ai');
 for(let turn=0;g.status!=='complete'&&turn<1000;turn++){
  const index=chooseAiCard(g);assert.notEqual(index,null);
  const next=flip(g,index);assert.notEqual(next,g);g=next;
  if(g.revealed.length===2)g=settle(g);
  assert.ok(validSession(g,cards));
 }
 assert.equal(g.status,'complete');assert.equal(g.scores[0]+g.scores[1],pairs);
});
test('grid uses landscape width and stays within the measured space for every mode',()=>{
 for(const count of [6,12,16])for(const [width,height] of [[1200,330],[1800,600],[300,340],[350,550],[580,220],[270,210]]){
  const g=fitGrid(width,height,count,8);
  assert.ok(g.columns*g.rows>=count);
  assert.ok(g.cardWidth*g.columns+8*(g.columns-1)<=width+.01);
  assert.ok(g.cardWidth*7/5*g.rows+8*(g.rows-1)<=height+.01);
 }
 const wide=fitGrid(1200,330,16,12);assert.ok(wide.columns>=6);assert.ok(wide.cardWidth>100);
});

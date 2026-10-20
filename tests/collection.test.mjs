import {test} from 'node:test';
import assert from 'node:assert/strict';
import {collectionIndex,swipeStep} from '../src/collection.js';
test('all 26 cards are reachable, wrapping cleanly in either direction',()=>{
 const seen=new Set();let index=0;for(let i=0;i<26;i++){seen.add(index);index=collectionIndex(index,1,26);}
 assert.equal(seen.size,26);assert.equal(index,0);assert.equal(collectionIndex(0,-1,26),25);assert.equal(collectionIndex(25,1,26),0);
});
test('horizontal swipes navigate while taps, tiny drags and vertical scrolling do not',()=>{
 assert.equal(swipeStep(-80,10),1);assert.equal(swipeStep(80,-10),-1);
 for(const [x,y] of [[0,0],[30,2],[50,80],[60,60]])assert.equal(swipeStep(x,y),0);
});

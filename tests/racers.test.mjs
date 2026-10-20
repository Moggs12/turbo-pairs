import {test} from 'node:test';
import assert from 'node:assert/strict';
import {racerCard,withRacerCars} from '../src/racers.js';
const cards=[{id:'01',file:'one.png'},{id:'02',file:'two.png'}];
test('legacy and invalid avatar ids use approved artwork without changing player ids or names',()=>{
 const players=[{id:'racer-1',name:'Kaiden'},{id:'racer-2',name:'Alex',avatarId:'../../other'}];
 const migrated=withRacerCars(players,cards);
 assert.deepEqual(migrated,[{id:'racer-1',name:'Kaiden',avatarId:'01'},{id:'racer-2',name:'Alex',avatarId:'02'}]);
 assert.equal(players[0].avatarId,undefined);
 assert.equal(racerCard(players[1],cards,1),cards[1]);
});
test('each racer choice survives settings and session round trips independently',()=>{
 const players=[{id:'racer-1',name:'Kaiden',avatarId:'02'},{id:'racer-2',name:'Alex',avatarId:'01'}];
 const restored=withRacerCars(JSON.parse(JSON.stringify(players)),cards);
 assert.deepEqual(restored,players);
 const session=JSON.parse(JSON.stringify({players:restored}));
 const changed=restored.map((p,i)=>i===0?{...p,avatarId:'01'}:p);
 assert.equal(session.players[0].avatarId,'02');assert.equal(changed[1].avatarId,'01');
});

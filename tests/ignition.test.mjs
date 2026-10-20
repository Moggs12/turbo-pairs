import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createIgnitionSound} from '../src/ignition.js';
class FakeAudio{static last;constructor(src){this.src=src;this.currentTime=2;this.calls=0;this.pauses=0;FakeAudio.last=this;}play(){this.calls++;return Promise.resolve();}pause(){this.pauses++;}}
test('approved start clip respects mute, restarts from zero and stops cleanly',()=>{
 let enabled=false;const cue=createIgnitionSound(FakeAudio,'audio/start-vroom-k.mp3',()=>enabled),a=FakeAudio.last;
 cue.play();assert.equal(a.calls,0);enabled=true;cue.play();assert.equal(a.calls,1);assert.equal(a.currentTime,0);
 a.currentTime=1;cue.play();assert.equal(a.calls,2);assert.equal(a.currentTime,0);cue.stop();assert.equal(a.pauses,3);
});
test('blocked or unavailable recorded playback never blocks a race',async()=>{
 assert.doesNotThrow(()=>createIgnitionSound(null,'').play());
 class Blocked extends FakeAudio{play(){return Promise.reject(new Error('blocked'));}}
 const cue=createIgnitionSound(Blocked,'');assert.doesNotThrow(()=>cue.play());await Promise.resolve();cue.stop();
});

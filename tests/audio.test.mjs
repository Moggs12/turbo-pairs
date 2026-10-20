import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSoundEngine} from '../src/audio.js';

class FakeContext {
 static instances = [];
 constructor(){
  this.state = 'running'; this.currentTime = 0; this.destination = {};
  this.starts = 0; this.resumes = 0; this.closed = false;
  FakeContext.instances.push(this);
 }
 createOscillator(){
  return {type:'sine',frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},
   connect(){},start:()=>{this.starts++;},stop(){}};
 }
 createGain(){
  return {gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};
 }
 resume(){this.resumes++;this.state='running';return Promise.resolve();}
 close(){this.state='closed';this.closed=true;return Promise.resolve();}
}

test('sound keeps working through multiple complete races and context restarts',()=>{
 FakeContext.instances=[];
 const audio=createSoundEngine(FakeContext);
 audio.play('start');audio.play('flip');audio.play('match');audio.play('finish');
 const first=FakeContext.instances[0];
 assert.equal(first.starts,2+1+3+7);
 audio.reset();audio.play('start');audio.play('flip');
 const second=FakeContext.instances[1];
 assert.notEqual(second,first);
 assert.equal(first.closed,true);
 assert.equal(second.starts,3);
});

test('WebKit interrupted and closed contexts are replaced before the next sound',()=>{
 FakeContext.instances=[];
 const audio=createSoundEngine(FakeContext);
 audio.play('flip');
 const first=FakeContext.instances[0];
 first.state='interrupted';
 audio.play('match');
 assert.equal(FakeContext.instances.length,2);
 assert.equal(FakeContext.instances[1].starts,3);
 FakeContext.instances[1].state='closed';
 audio.play('flip');
 assert.equal(FakeContext.instances.length,3);
 assert.equal(FakeContext.instances[2].starts,1);
});

test('suspended contexts resume on the next tap',async()=>{
 FakeContext.instances=[];
 const audio=createSoundEngine(FakeContext);
 audio.play('flip');
 const ctx=FakeContext.instances[0];
 ctx.state='suspended';
 audio.play('match');
 await Promise.resolve();
 assert.equal(ctx.resumes,1);
 assert.equal(ctx.starts,4);
});

test('mute persists outside the sound engine and prevents all cues',()=>{
 FakeContext.instances=[];
 let enabled=true;
 const audio=createSoundEngine(FakeContext,()=>enabled);
 audio.play('flip');
 const first=FakeContext.instances[0];assert.equal(first.starts,1);
 enabled=false;audio.reset();audio.play('finish');
 assert.equal(FakeContext.instances.length,1);
 enabled=true;audio.play('finish');
 assert.equal(FakeContext.instances[1].starts,7);
});

test('stale, delayed resume does not play old sounds in a new race',async()=>{
 FakeContext.instances=[];
 const audio=createSoundEngine(FakeContext);
 audio.play('flip');
 const ctx=FakeContext.instances[0];
 ctx.state='suspended';
 let allowResume;
 ctx.resume=()=>new Promise(resolve=>{allowResume=resolve;});
 audio.play('match');
 audio.reset();
 ctx.state='running';allowResume();
 await Promise.resolve();await Promise.resolve();
 assert.equal(ctx.starts,1);
 audio.play('flip');
 assert.equal(FakeContext.instances[1].starts,1);
});

test('audio gracefully skips playback when Web Audio is unavailable',()=>{
 const audio=createSoundEngine(null);
 assert.doesNotThrow(()=>{audio.play('flip');audio.wake();audio.reset();});
});

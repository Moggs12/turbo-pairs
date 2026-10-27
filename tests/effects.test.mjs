import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync('src/app.js','utf8');
const css=readFileSync('style.css','utf8');
const audio=readFileSync('src/audio.js','utf8');

test('flips and mismatches update existing card elements, preserving CSS 3D transitions',()=>{
 const play=app.slice(app.indexOf('function playCard('),app.indexOf('function schedule()'));
 assert.match(play,/updateBoard\(matchId\)/);
 assert.doesNotMatch(play,/(?:^|[^a-zA-Z])board\(\)/);
 assert.match(app,/button\.classList\.toggle\('open',open\)/);
 assert.match(app,/game=settle\(game\);persist\(\);updateBoard\(\)/);
 assert.match(css,/\.card\.open \.inner\{transform:rotateY\(180deg\)\}/);
 assert.match(css,/\.card\.match-pop/);
});

test('audio and artwork title badge remain optional and reduced motion is respected',()=>{
 for(const cue of ['flip','miss','match','start','finish'])
  assert.match(audio,new RegExp("case '"+cue+"'"));
 assert.match(app,/createSoundEngine\(window\.AudioContext \|\| window\.webkitAudioContext, \(\) => !!settings\.sound\)/);
 assert.match(app,/if\(typeof settings\.sound!=='boolean'\)settings\.sound=true/);
 assert.match(app,/class="menu-wordmark"/);
 assert.match(css,/\.menu-wordmark/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

test('results screen shows collected cars, stars and the perfect-race cues',()=>{
 for(const cue of ['pop','star1','star2','star3','perfect'])
  assert.match(audio,new RegExp("case '"+cue+"'"));
 assert.doesNotMatch(app,/victory-confetti/);
 assert.match(app,/class=\\?"found-cars/);
 assert.match(app,/perfect-banner/);
 assert.match(css,/\.found-car\{/);
 assert.match(css,/\.result-star\.earned/);
 // Leaving the results screen cancels any sounds still queued.
 assert.match(app,/\$\('#again'\)\.onclick=\(\)=>\{clearResultTimers\(\);/);
});

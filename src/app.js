import {fitGrid} from './layout.js';
import {createGame,flip,settle,applyResult,validSession,chooseAiCard} from './engine.js';
const $=s=>document.querySelector(s),app=$('#app'),theme='hot-wheels',base='themes/hot-wheels/';
let game,timer,paused=false,config,deck,selected='easy',settings={},records={},audio;
const modeLabels={solo:'On my own',ai:'Against the computer',two:'Two players'};
const key=(type,mode=game?(game.mode||'two'):(settings.mode||'solo'))=>`turbo-pairs:v1:${type}:${theme}${type==='records'&&mode!=='two'?':'+mode:''}`;
function loadRecords(mode){const value=read(key('records',mode),{});return value&&typeof value==='object'&&Array.isArray(value.completed)&&value.players?value:{completed:[],players:{}};}
function fitBoard(){const area=document.querySelector('.board-space'),grid=document.querySelector('.board');if(!area||!grid)return;const box=area.getBoundingClientRect(),style=getComputedStyle(grid),inset=parseFloat(style.paddingLeft)*2+parseFloat(style.borderLeftWidth)*2;const gap=innerWidth<650?8:12;const layout=fitGrid(Math.max(1,box.width-inset-4),Math.max(1,box.height-inset-8),game.deck.length,gap);grid.style.setProperty('--cols',layout.columns);grid.style.setProperty('--card-width',`${layout.cardWidth}px`);grid.style.setProperty('--gap',`${gap}px`);}
const boardObserver=new ResizeObserver(fitBoard);

function warning(){ $('#storage').textContent='Saving is unavailable. You can still play, but progress may not be remembered.'; }
function read(k,fallback){try{return JSON.parse(localStorage.getItem(k))??fallback;}catch{warning();return fallback;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{warning();return false;}}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Short, original Web Audio cues: no external downloads or autoplay.
function sound(type){
 if(!settings.sound)return;
 try{
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio)return;
  audio ||= new Audio();
  if(audio.state==='suspended')void audio.resume().catch(()=>{});
  const now=audio.currentTime;
  const tone=(delay,frequency,duration,wave='sine',volume=.055,endFrequency=frequency)=>{
   const start=now+delay,end=start+duration;
   const osc=audio.createOscillator(),gain=audio.createGain();
   osc.type=wave;osc.frequency.setValueAtTime(frequency,start);
   osc.frequency.exponentialRampToValueAtTime(Math.max(25,endFrequency),end);
   gain.gain.setValueAtTime(.0001,start);
   gain.gain.exponentialRampToValueAtTime(volume,start+Math.min(.018,duration/4));
   gain.gain.exponentialRampToValueAtTime(.0001,end);
   osc.connect(gain);gain.connect(audio.destination);osc.start(start);osc.stop(end+.01);
  };
  switch(type){
   case 'flip': tone(0,550,.13,'triangle',.04,210);break;
   case 'miss': tone(0,310,.14,'triangle',.038,190);tone(.09,230,.16,'sine',.025,150);break;
   case 'match': tone(0,523,.16,'sine',.065);tone(.12,659,.18,'sine',.065);tone(.27,784,.28,'triangle',.07);break;
   case 'start': tone(0,110,.38,'sawtooth',.04,360);tone(.31,520,.16,'triangle',.04,780);break;
   case 'finish':
    tone(0,130,.55,'sawtooth',.027,310);
    [[0,523,.18],[.17,659,.18],[.34,784,.18],[.51,1047,.48],[.68,784,.16],[.85,1047,.54]].forEach(([t,f,d])=>tone(t,f,d,'triangle',.065));
    break;
   default: tone(0,440,.13,'sine',.03);
  }
 }catch{}
}
function soundLabel(){ $('#sound').textContent=settings.sound?'🔊 Sound on':'🔇 Sound off';$('#sound').setAttribute('aria-pressed',String(!!settings.sound));}
$('#sound').onclick=()=>{settings.sound=!settings.sound;save(config.storage.settingsKey,settings);soundLabel();sound('flip');};
function recordHtml(){return `<div class="records"><strong>OUR TROPHIES</strong> · saved on this device${Object.values(records.players||{}).map(p=>`<p><strong>${esc(p.name)}</strong> · ${p.wins} wins · ${p.draws} draws · ${p.gamesPlayed} games · ${p.pairsCollected} pairs</p>`).join('')||'<p>Your first race starts the story.</p>'}</div>`;}
function home(){records=loadRecords(settings.mode||'solo');boardObserver.disconnect();window.scrollTo(0,0);clearTimeout(timer);paused=false;app.innerHTML=`<section class="menu" aria-label="Game menu"><div class="menu-banner"><svg class="menu-logo" viewBox="45 575 970 310" role="img" aria-label="Hot Wheels"><defs><clipPath id="menu-logo-crop"><rect x="45" y="575" width="970" height="310"/></clipPath></defs><image href="${base+deck.back}" width="1060" height="1484" clip-path="url(#menu-logo-crop)"/></svg><div class="turbo-badge" role="img" aria-label="Kaiden’s Turbo Pairs"><span>KAIDEN’S</span><strong>TURBO PAIRS</strong></div></div><form class="menu-form" data-mode="${settings.mode||'solo'}"><div class="menu-controls"><fieldset><legend>How shall we play?</legend><div class="menu-modes" role="group" aria-label="Play mode">${Object.entries(modeLabels).map(([id,label])=>`<button type="button" data-mode="${id}" class="mode ${settings.mode===id?'selected':''}" aria-pressed="${settings.mode===id}"><span aria-hidden="true">${id==='solo'?'🙂':id==='ai'?'🤖':'👫'}</span>${label}</button>`).join('')}</div></fieldset><div class="menu-names">${settings.players.map((p,i)=>`<label ${i===1&&settings.mode!=='two'?'hidden':''}>${i===0?'🏎️':'🚙'} ${settings.mode==='two'?`Racer ${i+1}`:'Your name'}<input name="player${i}" maxlength="24" required value="${esc(p.name)}" autocomplete="off" aria-label="Racer ${i+1} name"></label>`).join('')}</div><fieldset><legend>Pick your challenge!</legend><div class="menu-levels">${config.difficulties.map((d,i)=>`<button type="button" class="level level-${i} ${d.id===selected?'selected':''}" data-level="${d.id}" aria-pressed="${d.id===selected}"><span class="level-icon" aria-hidden="true">${['🚗','🏎️','🚀'][i]}</span><b>${esc(d.label)}</b><span>${d.pairs*2} cards</span><span class="picked" aria-hidden="true">✓</span></button>`).join('')}</div></fieldset></div><div class="menu-launch"><button class="engine-start" type="submit" aria-label="Let’s start"><span class="engine-face"><span class="ignition-light" aria-hidden="true"></span><small>ENGINE</small><strong>LET’S<br>START</strong></span></button><div class="menu-extras">${game?.status==='playing'?'<button type="button" class="menu-secondary" id="resume">▶ Continue game</button>':''}<button type="button" class="menu-secondary" id="records">🏆 Our scores</button></div></div></form></section>`;
 app.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{selected=b.dataset.level;app.querySelectorAll('[data-level]').forEach(a=>{a.classList.toggle('selected',a===b);a.setAttribute('aria-pressed',String(a===b));});});
 app.querySelectorAll('button[data-mode]').forEach(button=>button.onclick=()=>{const data=new FormData(app.querySelector('form'));settings.players=settings.players.map((p,i)=>({...p,name:String(data.get(`player${i}`)||p.name).trim()||p.name}));settings.mode=button.dataset.mode;save(config.storage.settingsKey,settings);records=loadRecords(settings.mode);home();});
 $('#records').onclick=()=>overlay('Our scores','Saved on this device',[{label:'Back to menu',action:()=>{}}],recordHtml());
 $('#resume')?.addEventListener('click',()=>{board();schedule();});
 app.querySelector('form').onsubmit=async e=>{e.preventDefault();const form=new FormData(e.target);settings.players=settings.players.map((p,i)=>({...p,name:String(form.get(`player${i}`)).trim()||`Racer ${i+1}`}));settings.difficulty=selected;save(config.storage.settingsKey,settings);const begin=()=>{const mode=settings.mode||'solo',players=mode==='solo'?[settings.players[0]]:mode==='ai'?[settings.players[0],{id:'computer',name:'Turbo Bot'}]:settings.players;game=createGame(deck.cards,config.difficulties.find(d=>d.id===selected),players,undefined,mode);records=loadRecords(mode);persist();board();sound('start');};if(game?.status==='playing')confirmOverlay('Start a new race?','Your unfinished race will be replaced.',begin);else begin();};
}
function persist(){save(key('session'),game);}
function scoreHtml(){return `<div class="scores">${game.players.map((p,i)=>`<div class="player racer-${i} ${game.active===i&&game.status==='playing'?'active':''}"><span class="avatar" aria-hidden="true">${i===0?'🏎️':'🚙'}</span><div>${esc(p.name)}<small>${game.status==='complete'?'PAIRS FOUND':game.active===i?'YOUR TURN':'READY TO RACE'}</small></div><strong>${game.scores[i]}</strong></div>`).join('')}${game.mode==='solo'?`<div class="player solo-stat"><div>Turns<small>FEWER TURNS IS BETTER</small></div><strong>${game.moves}</strong></div>`:''}</div>`;}
function board(){boardObserver.disconnect();if(!document.querySelector(".race"))window.scrollTo(0,0);paused=false;const difficulty=config.difficulties.find(d=>d.id===game.difficultyId);app.innerHTML=`<section class="race"><div class="racebar"><h2>${esc(difficulty?.label||'Custom')} race <span class="eyebrow">${modeLabels[game.mode||'two']}</span></h2><div class="actions"><button id="pause" class="quiet">Ⅱ Pause</button><button id="garage" class="quiet">⌂ Menu</button></div></div>${scoreHtml()}<p class="turn" role="status" aria-live="polite">${game.revealed.length===2?'Same cars? Let’s see…':game.mode==='ai'&&game.active===1?'Turbo Bot is thinking…':`${esc(game.players[game.active].name)}, your turn!`}</p><div class="board-space"><div class="board ${game.pairCount===3?'easy':game.pairCount===6?'medium':'hard'}" aria-label="Memory cards">${game.deck.map((c,i)=>{const matched=game.matched.includes(c.id),open=matched||game.revealed.includes(i);return `<button class="card ${open?'open':''} ${matched?'matched':''}" data-card="${i}" aria-label="${open?esc(c.name)+(matched?', matched':''): `Face-down card ${i+1}`}" ${matched||(game.mode==='ai'&&game.active===1)?'disabled':''}><span class="inner"><img src="${base+deck.back}" alt="" draggable="false"><img class="front" src="${base+c.file}" alt="" draggable="false"></span></button>`;}).join('')}</div></div><p class="race-note"><span class="progress-track"><span style="width:${game.matched.length/game.pairCount*100}%"></span></span><span class="pair-count">⭐ ${game.matched.length} / ${game.pairCount} pairs found</span></p></section>`;
 fitBoard();boardObserver.observe(document.querySelector('.board-space'));
 app.querySelectorAll('[data-card]').forEach(b=>b.onclick=()=>playCard(Number(b.dataset.card)));
 $('#pause').onclick=()=>{if(game.status==='complete'){finish();return;}clearTimeout(timer);paused=true;overlay('Pit stop','A little break. Ready to play again?',[{label:'▶ Keep playing',action:()=>{board();schedule();}}]);};$('#garage').onclick=home;
}
// Keep card nodes mounted while flipping; replacing them cancels CSS transitions.
function updateBoard(newMatch){
 const race=app.querySelector('.race');
 if(!race)return;
 const turn=race.querySelector('.turn');
 if(turn)turn.textContent=game.status==='complete'?'🏁 Every pair found!':game.revealed.length===2?'Same cars? Let’s see…':game.mode==='ai'&&game.active===1?'Turbo Bot is thinking…':`${game.players[game.active].name}, your turn!`;
 const scores=race.querySelector('.scores');
 if(scores)scores.outerHTML=scoreHtml();
 race.querySelectorAll('[data-card]').forEach(button=>{
  const index=Number(button.dataset.card),card=game.deck[index],matched=game.matched.includes(card.id),open=matched||game.revealed.includes(index);
  button.classList.toggle('open',open);
  button.classList.toggle('matched',matched);
  button.setAttribute('aria-label',open?card.name+(matched?', matched':''):`Face-down card ${index+1}`);
  button.disabled=matched||game.status!=='playing'||game.revealed.length===2||(game.mode==='ai'&&game.active===1);
  if(newMatch&&card.id===newMatch){
   button.classList.remove('match-pop');
   void button.offsetWidth;
   button.classList.add('match-pop');
   setTimeout(()=>button.classList.remove('match-pop'),950);
  }
 });
 const progress=race.querySelector('.progress-track > span');
 if(progress)progress.style.width=`${game.matched.length/game.pairCount*100}%`;
 const pairCount=race.querySelector('.pair-count');
 if(pairCount)pairCount.textContent=`⭐ ${game.matched.length} / ${game.pairCount} pairs found`;
}
function playCard(index,bot=false){
 if(paused||game.mode==='ai'&&game.active===1&&!bot)return;
 const before=game;
 game=flip(game,index);
 if(game===before)return;
 const matchId=game.matched.find(id=>!before.matched.includes(id));
 sound(matchId?'match':'flip');
 persist();
 updateBoard(matchId);
 if(!bot)app.querySelector(`[data-card="${index}"]`)?.focus({preventScroll:true});
 if(game.status==='complete'){
  clearTimeout(timer);
  // Allow the final card flip and match celebration to finish first.
  timer=setTimeout(()=>{if(game?.status==='complete'&&app.querySelector('.race'))finish();},1150);
 }else schedule();
}
function schedule(){clearTimeout(timer);if(paused||game?.status!=='playing'||!document.querySelector('.race'))return;if(game.revealed.length===2){timer=setTimeout(()=>{game=settle(game);persist();updateBoard();sound('miss');schedule();},1200);}else if(game.mode==='ai'&&game.active===1){timer=setTimeout(()=>{const index=chooseAiCard(game);if(index!==null)playCard(index,true);},750);}}
function overlay(title,text,actions,extraHtml=''){const el=document.createElement('div');el.className='overlay';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');el.setAttribute('aria-label',title);const previous=document.activeElement;el.innerHTML=`<div><h2>${esc(title)}</h2><p>${esc(text)}</p>${extraHtml}${actions.map((a,i)=>`<button class="${i===0?'primary':'quiet'}">${esc(a.label)}</button>`).join('')}</div>`;document.body.append(el);const buttons=[...el.querySelectorAll('button')];buttons.forEach((b,i)=>b.onclick=()=>{el.remove();previous?.focus();actions[i].action();});el.onkeydown=e=>{if(e.key==='Tab'){e.preventDefault();buttons[(buttons.indexOf(document.activeElement)+(e.shiftKey?buttons.length-1:1))%buttons.length].focus();}};buttons[0].focus();}
function confirmOverlay(title,text,action){overlay(title,text,[{label:'Start new race',action},{label:'Keep this race',action:()=>{}}]);}
function finish(){boardObserver.disconnect();clearTimeout(timer);window.scrollTo(0,0);records=loadRecords(game.mode||'two');const updated=applyResult(records,game);if(save(key('records'),updated))records=updated;const draw=game.scores[0]===game.scores[1],winner=game.players[game.scores[0]>game.scores[1]?0:1];app.innerHTML=`<section class="result"><div class="celebrate" aria-hidden="true">🏁</div><div class="victory-confetti" aria-hidden="true"><span>⭐</span><span>🎉</span><span>🏆</span><span>🎉</span><span>⭐</span></div><span class="eyebrow">RACE COMPLETE</span><h1>${game.mode==='solo'?'You found them all!':draw?'A brilliant draw!':`${esc(winner.name)}<br><em>takes the flag!</em>`}</h1><p>${game.mode==='solo'?`All ${game.pairCount} pairs in ${game.moves} turns. Brilliant racing!`:'Every pair found. Great racing!'}</p>${scoreHtml()}<button id="again" class="primary">Race again →</button><button id="back" class="quiet">Back to garage</button>${recordHtml()}</section>`;$('#again').onclick=()=>{game=createGame(deck.cards,{id:game.difficultyId,pairs:game.pairCount},game.players,undefined,game.mode||'two');persist();board();};$('#back').onclick=home;sound('finish');}
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game?.status==='playing'&&$('#pause'))$('#pause').click();});
try{[config,deck]=await Promise.all(['src/config/game.json',base+'deck.json'].map(async u=>{const r=await fetch(u);if(!r.ok)throw Error();return r.json();}));settings=read(config.storage.settingsKey,{});if(!settings||typeof settings!=='object')settings={};if(!Array.isArray(settings.players)||settings.players.length!==2||settings.players.some(p=>typeof p?.id!=='string'||typeof p?.name!=='string')||settings.players[0].id===settings.players[1].id)settings.players=[{id:'racer-1',name:'Kaiden'},{id:'racer-2',name:'Racer 2'}];if(!['solo','ai','two'].includes(settings.mode))settings.mode='solo';if(typeof settings.sound!=='boolean')settings.sound=true;selected=config.difficulties.some(d=>d.id===settings.difficulty)?settings.difficulty:config.defaultDifficulty;records=read(key('records'),{});if(!records||typeof records!=='object'||Array.isArray(records)||!Array.isArray(records.completed)||!records.players)records={completed:[],players:{}};const saved=read(key('session'),null);if(validSession(saved,deck.cards)){game=settle(saved);records=loadRecords(game.mode||'two');persist();if(game.status==='complete')records=applyResult(records,game);save(key('records'),records);}records=loadRecords(settings.mode);soundLabel();home();}catch(e){app.innerHTML='<section class="result"><h2>The garage couldn’t load.</h2><p>Please refresh to try again.</p></section>';console.error(e);}

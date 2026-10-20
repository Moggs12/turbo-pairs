export function shuffle(items, random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createGame(cards,difficulty,players,id=crypto.randomUUID(),mode="two"){
 if(!Number.isInteger(difficulty.pairs)||difficulty.pairs<1||difficulty.pairs>new Set(cards.map(c=>c.id)).size)throw Error('Invalid pair count');
 if(!['solo','ai','two'].includes(mode)||players.length!==(mode==='solo'?1:2))throw Error('Invalid players');
 const chosen=shuffle(cards).slice(0,difficulty.pairs);
 return {id,mode,memory:{},themeId:'hot-wheels',difficultyId:difficulty.id,pairCount:difficulty.pairs,players:[...players],deck:shuffle(chosen.flatMap(c=>[{...c},{...c}])),matched:[],revealed:[],scores:players.map(()=>0),active:0,moves:0,status:'playing'};
}
export function flip(game,index){
 if(game.status!=='playing'||!Number.isInteger(index)||index<0||index>=game.deck.length||game.revealed.length===2||game.revealed.includes(index)||game.matched.includes(game.deck[index].id))return game;
 const g={...game,memory:{...game.memory,[index]:game.deck[index].id},revealed:[...game.revealed,index]};
 if(g.revealed.length===2){g.moves++;const [a,b]=g.revealed.map(i=>g.deck[i]);if(a.id===b.id){g.matched=[...g.matched,a.id];g.scores=[...g.scores];g.scores[g.active]++;g.revealed=[];if(g.matched.length===g.pairCount)g.status='complete';}}
 return g;
}
export function settle(game){return game.revealed.length===2?{...game,revealed:[],active:game.mode==='solo'?0:1-game.active}:game;}
export function applyResult(records,game){
 if(game.status!=='complete'||records.completed?.includes(game.id))return records;
 const next=JSON.parse(JSON.stringify(records));next.completed=[...(next.completed||[]),game.id];next.players ||= {};
 game.players.forEach((p,i)=>{const r=next.players[p.id]||{gamesPlayed:0,wins:0,losses:0,draws:0,pairsCollected:0};r.name=p.name;r.gamesPlayed++;r.pairsCollected+=game.scores[i];r[game.mode==='solo'?'wins':game.scores[i]===game.scores[1-i]?'draws':game.scores[i]>game.scores[1-i]?'wins':'losses']++;next.players[p.id]=r;});return next;
}
export function validSession(g,cards){
 if(!g||g.themeId!=='hot-wheels'||!['playing','complete'].includes(g.status)||typeof g.id!=='string'||!Number.isInteger(g.pairCount)||g.pairCount<1||g.pairCount>cards.length||!Array.isArray(g.deck)||g.deck.length!==g.pairCount*2)return false;
 if(g.mode!==undefined&&!['solo','ai','two'].includes(g.mode))return false;
 const playerCount=g.mode==='solo'?1:2;
 const counts={};for(const c of g.deck){if(!cards.some(a=>a.id===c.id&&a.file===c.file))return false;counts[c.id]=(counts[c.id]||0)+1;}
 return Object.values(counts).every(n=>n===2)&&Object.keys(counts).length===g.pairCount&&Array.isArray(g.players)&&g.players.length===playerCount&&g.players.every(p=>typeof p.id==='string'&&typeof p.name==='string')&&new Set(g.players.map(p=>p.id)).size===playerCount&&Number.isInteger(g.active)&&g.active>=0&&g.active<playerCount&&Array.isArray(g.matched)&&new Set(g.matched).size===g.matched.length&&g.matched.every(id=>counts[id])&&Array.isArray(g.revealed)&&g.revealed.length<=2&&new Set(g.revealed).size===g.revealed.length&&g.revealed.every(i=>Number.isInteger(i)&&i>=0&&i<g.deck.length&&!g.matched.includes(g.deck[i].id))&&Array.isArray(g.scores)&&g.scores.length===playerCount&&g.scores.every(n=>Number.isInteger(n)&&n>=0)&&g.scores.reduce((a,b)=>a+b,0)===g.matched.length&&(g.status==='complete')===(g.matched.length===g.pairCount);
}

// Only remembered, publicly revealed identities are consulted. Hidden card
// identities in the shuffled deck are never inspected to choose a move.
export function chooseAiCard(game, random = Math.random, memoryRecall = 1) {
 const memory=game.memory||{}, shown=game.revealed;
 const available=Array.from({length:game.deck.length},(_,i)=>i).filter(i=>!shown.includes(i)&&!game.matched.includes(memory[i]));
 if(!available.length)return null;
 // On Easy, a missed recall becomes a genuine guess among all legal cards.
 // Do not prefer unknown cards here: that can force a remembered pair.
 if(memoryRecall<1&&random()>=Math.max(0,memoryRecall))return available[Math.floor(random()*available.length)];
 if(shown.length===1){const other=available.find(i=>memory[i]&&memory[i]===memory[shown[0]]);if(other!==undefined)return other;}
 else {for(const i of available){if(memory[i]&&available.some(j=>j!==i&&memory[j]===memory[i]))return i;}}
 const unknown=available.filter(i=>!memory[i]);
 const choices=unknown.length?unknown:available;
 return choices[Math.floor(random()*choices.length)];
}

export function shuffle(items, random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function createGame(cards,difficulty,players,id=crypto.randomUUID()){
 if(!Number.isInteger(difficulty.pairs)||difficulty.pairs<1||difficulty.pairs>new Set(cards.map(c=>c.id)).size)throw Error('Invalid pair count');
 const chosen=shuffle(cards).slice(0,difficulty.pairs);
 return {id,themeId:'hot-wheels',difficultyId:difficulty.id,pairCount:difficulty.pairs,players:[...players],deck:shuffle(chosen.flatMap(c=>[{...c},{...c}])),matched:[],revealed:[],scores:[0,0],active:0,moves:0,status:'playing'};
}
export function flip(game,index){
 if(game.status!=='playing'||!Number.isInteger(index)||index<0||index>=game.deck.length||game.revealed.length===2||game.revealed.includes(index)||game.matched.includes(game.deck[index].id))return game;
 const g={...game,revealed:[...game.revealed,index]};
 if(g.revealed.length===2){g.moves++;const [a,b]=g.revealed.map(i=>g.deck[i]);if(a.id===b.id){g.matched=[...g.matched,a.id];g.scores=[...g.scores];g.scores[g.active]++;g.revealed=[];if(g.matched.length===g.pairCount)g.status='complete';}}
 return g;
}
export function settle(game){return game.revealed.length===2?{...game,revealed:[],active:1-game.active}:game;}
export function applyResult(records,game){
 if(game.status!=='complete'||records.completed?.includes(game.id))return records;
 const next=JSON.parse(JSON.stringify(records));next.completed=[...(next.completed||[]),game.id];next.players ||= {};
 game.players.forEach((p,i)=>{const r=next.players[p.id]||{gamesPlayed:0,wins:0,losses:0,draws:0,pairsCollected:0};r.name=p.name;r.gamesPlayed++;r.pairsCollected+=game.scores[i];r[game.scores[i]===game.scores[1-i]?'draws':game.scores[i]>game.scores[1-i]?'wins':'losses']++;next.players[p.id]=r;});return next;
}
export function validSession(g,cards){
 if(!g||g.themeId!=='hot-wheels'||!['playing','complete'].includes(g.status)||typeof g.id!=='string'||!Number.isInteger(g.pairCount)||g.pairCount<1||g.pairCount>cards.length||!Array.isArray(g.deck)||g.deck.length!==g.pairCount*2)return false;
 const counts={};for(const c of g.deck){if(!cards.some(a=>a.id===c.id&&a.file===c.file))return false;counts[c.id]=(counts[c.id]||0)+1;}
 return Object.values(counts).every(n=>n===2)&&Object.keys(counts).length===g.pairCount&&Array.isArray(g.players)&&g.players.length===2&&g.players.every(p=>typeof p.id==='string'&&typeof p.name==='string')&&g.players[0].id!==g.players[1].id&&[0,1].includes(g.active)&&Array.isArray(g.matched)&&new Set(g.matched).size===g.matched.length&&g.matched.every(id=>counts[id])&&Array.isArray(g.revealed)&&g.revealed.length<=2&&new Set(g.revealed).size===g.revealed.length&&g.revealed.every(i=>Number.isInteger(i)&&i>=0&&i<g.deck.length&&!g.matched.includes(g.deck[i].id))&&Array.isArray(g.scores)&&g.scores.length===2&&g.scores.every(n=>Number.isInteger(n)&&n>=0)&&g.scores[0]+g.scores[1]===g.matched.length&&(g.status==='complete')===(g.matched.length===g.pairCount);
}

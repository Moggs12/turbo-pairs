export const TROPHIES=[
 {id:'first-win',name:'Victory cup',kind:'wins',target:1,mark:'1',description:'One cup for every win'},
 {id:'five-wins',name:'Five-star racer',kind:'wins',target:5,mark:'5',description:'One cup for every 5 wins'},
 {id:'ten-wins',name:'Turbo champion',kind:'wins',target:10,mark:'10',description:'One cup for every 10 wins'},
 {id:'easy',name:'Easy explorer',kind:'difficulty',target:1,mark:'E',description:'One cup per Easy finish'},
 {id:'medium',name:'Medium master',kind:'difficulty',target:1,mark:'M',description:'One cup per Medium finish'},
 {id:'hard',name:'Hard hero',kind:'difficulty',target:1,mark:'H',description:'One cup per Hard finish'}
];
export function trophyProgress(recordSets,playerId){
 const players=recordSets.map(records=>records.players?.[playerId]).filter(Boolean);
 const wins=players.reduce((total,p)=>total+(Number.isInteger(p.wins)&&p.wins>0?p.wins:0),0);
 return TROPHIES.map(trophy=>{
  const current=trophy.kind==='wins'?wins:players.reduce((total,p)=>total+(Number.isInteger(p.difficulties?.[trophy.id])&&p.difficulties[trophy.id]>0?p.difficulties[trophy.id]:0),0);
  const earnedCount=Math.floor(current/trophy.target),nextTarget=(earnedCount+1)*trophy.target;
  return {...trophy,current,earnedCount,nextTarget,earned:earnedCount>0};
 });
}

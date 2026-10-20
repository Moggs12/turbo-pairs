export const TROPHIES=[
 {id:'first-win',name:'First victory',kind:'wins',target:1,mark:'1',description:'Win your first race'},
 {id:'five-wins',name:'Five-star racer',kind:'wins',target:5,mark:'5',description:'Win 5 races'},
 {id:'ten-wins',name:'Turbo champion',kind:'wins',target:10,mark:'10',description:'Win 10 races'},
 {id:'easy',name:'Easy explorer',kind:'difficulty',target:1,mark:'E',description:'Finish an Easy race'},
 {id:'medium',name:'Medium master',kind:'difficulty',target:1,mark:'M',description:'Finish a Medium race'},
 {id:'hard',name:'Hard hero',kind:'difficulty',target:1,mark:'H',description:'Finish a Hard race'}
];
export function trophyProgress(recordSets,playerId){
 const players=recordSets.map(records=>records.players?.[playerId]).filter(Boolean);
 const wins=players.reduce((total,p)=>total+(Number.isInteger(p.wins)&&p.wins>0?p.wins:0),0);
 return TROPHIES.map(trophy=>{
  const current=trophy.kind==='wins'?wins:players.reduce((total,p)=>total+(Number.isInteger(p.difficulties?.[trophy.id])&&p.difficulties[trophy.id]>0?p.difficulties[trophy.id]:0),0);
  return {...trophy,current,earned:current>=trophy.target};
 });
}

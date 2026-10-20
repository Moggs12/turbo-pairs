// Only ids from the approved deck can become racer artwork.
export function racerCard(player,cards,index=0){
 return cards.find(card=>card.id===player?.avatarId)||cards[index%cards.length];
}
export function withRacerCars(players,cards){
 return players.map((player,index)=>({...player,avatarId:racerCard(player,cards,index).id}));
}

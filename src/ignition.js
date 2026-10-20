// Play the approved K audition directly from the red-button gesture.
export function createIgnitionSound(AudioClass,src,enabled=()=>true){
 let audio=null;
 try{if(AudioClass){audio=new AudioClass(src);audio.preload='auto';}}catch{}
 function stop(){if(!audio)return;try{audio.pause();audio.currentTime=0;}catch{}}
 function play(){if(!audio||!enabled())return;stop();try{const result=audio.play();result?.catch?.(()=>{});}catch{}}
 return {play,stop};
}

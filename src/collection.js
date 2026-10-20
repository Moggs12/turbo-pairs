export function collectionIndex(index,step,count){return ((index+step)%count+count)%count;}
export function swipeStep(dx,dy){return Math.abs(dx)>=45&&Math.abs(dx)>Math.abs(dy)*1.3?(dx<0?1:-1):0;}

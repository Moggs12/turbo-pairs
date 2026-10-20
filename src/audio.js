// Small, recoverable Web Audio engine. Designed for iOS Safari / installed PWAs.
// Call play() directly from a tap whenever possible, so resume() has a user gesture.
export function createSoundEngine(AudioContextClass, enabled = () => true) {
 let context = null;
 let generation = 0;
 let cueNumber = 0;

 function reset() {
  const old = context;
  context = null;
  generation++;
  cueNumber++;
  if (old && old.state !== 'closed') {
   try { const result = old.close?.(); result?.catch?.(() => {}); } catch {}
  }
 }

 function getContext() {
  if (!AudioContextClass) return null;
  // WebKit may leave an audio context 'interrupted' after app switching,
  // locking the screen, or finishing a previous game.
  if (context && (context.state === 'interrupted' || context.state === 'closed')) reset();
  if (!context) {
   try { context = new AudioContextClass(); } catch { return null; }
  }
  return context;
 }

 function cue(ctx, type) {
  const now = ctx.currentTime;
  const tone = (delay, frequency, duration, wave = 'sine', volume = .055, endFrequency = frequency) => {
   const start = now + delay, end = start + duration;
   const oscillator = ctx.createOscillator(), gain = ctx.createGain();
   oscillator.type = wave;
   oscillator.frequency.setValueAtTime(frequency, start);
   oscillator.frequency.exponentialRampToValueAtTime(Math.max(25, endFrequency), end);
   gain.gain.setValueAtTime(.0001, start);
   gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(.018, duration / 4));
   gain.gain.exponentialRampToValueAtTime(.0001, end);
   oscillator.connect(gain);
   gain.connect(ctx.destination);
   oscillator.start(start);
   oscillator.stop(end + .01);
  };
  const noise=(duration,volume,from,to)=>{
   const buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),data=buffer.getChannelData(0);
   for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;
   const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
   source.buffer=buffer;filter.type='bandpass';filter.Q.value=.7;
   filter.frequency.setValueAtTime(from,now);filter.frequency.exponentialRampToValueAtTime(to,now+duration);
   gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(volume,now+.035);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
   source.connect(filter);filter.connect(gain);gain.connect(ctx.destination);source.start(now);source.stop(now+duration+.01);
  };
  switch (type) {
   case 'flip': noise(.23,.24,2800,500); break;
   case 'miss': noise(.22,.14,1800,380); break;
   case 'match':
    // Low engine harmonics climb together, then drop as the throttle lifts.
    [1,2,3].forEach((harmonic)=>{
     const oscillator=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
     oscillator.type='sawtooth';oscillator.frequency.setValueAtTime(48*harmonic,now);
     oscillator.frequency.exponentialRampToValueAtTime(155*harmonic,now+.48);
     oscillator.frequency.exponentialRampToValueAtTime(65*harmonic,now+.82);
     filter.type='lowpass';filter.frequency.setValueAtTime(450,now);filter.frequency.exponentialRampToValueAtTime(2200,now+.48);filter.frequency.exponentialRampToValueAtTime(500,now+.82);
     gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(.065/harmonic,now+.06);gain.gain.exponentialRampToValueAtTime(.0001,now+.84);
     oscillator.connect(filter);filter.connect(gain);gain.connect(ctx.destination);oscillator.start(now);oscillator.stop(now+.86);
    });
    noise(.82,.045,250,1100);break;
   case 'ignition':
    // A toy-car starter: quick soft chugs, then a cheerful rising vroom.
    [0,.07,.14].forEach((delay,i)=>tone(delay,140+i*20,.055,'triangle',.055,105+i*15));
    tone(.2,75,.65,'sawtooth',.025,260);
    tone(.2,150,.65,'triangle',.045,520);
    break;
   case 'countdown': tone(0,660,.11,'triangle',.08);break;
   case 'start': tone(0,990,.58,'triangle',.09);break;
   case 'finish':
    // A short major-key brass-style fanfare, ending on a bright held note.
    [[0,523,.13],[.16,659,.13],[.32,784,.17],[.52,1047,.5]].forEach(([delay,frequency,duration])=>{
     tone(delay,frequency,duration,'triangle',.075);
     tone(delay,frequency*1.5,duration,'sawtooth',.018);
    });break;
  }
 }

 function play(type) {
  if (!enabled()) return;
  const ctx = getContext();
  if (!ctx) return;
  const currentGeneration = generation, currentCue = ++cueNumber;
  let sent = false;
  const send = () => {
   if (!sent && type && enabled() && context === ctx &&
    generation === currentGeneration && cueNumber === currentCue && ctx.state === 'running') {
    sent = true;
    try { cue(ctx, type); } catch {}
   }
  };

  if (ctx.state === 'running') { send(); return; }
  // Calling resume synchronously is important: iOS requires a tap to unlock audio.
  try {
   const resumed = ctx.resume?.();
   send();
   if (resumed?.then) void resumed.then(send, () => {});
  } catch {}
 }

 return {play, reset, wake: () => play(null)};
}

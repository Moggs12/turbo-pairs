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
  switch (type) {
   case 'flip': tone(0, 550, .13, 'triangle', .04, 210); break;
   case 'miss': tone(0, 310, .14, 'triangle', .038, 190); tone(.09, 230, .16, 'sine', .025, 150); break;
   case 'match': tone(0, 523, .16, 'sine', .065); tone(.12, 659, .18, 'sine', .065); tone(.27, 784, .28, 'triangle', .07); break;
   case 'start': tone(0, 110, .38, 'sawtooth', .04, 360); tone(.31, 520, .16, 'triangle', .04, 780); break;
   case 'finish':
    tone(0, 130, .55, 'sawtooth', .027, 310);
    [[0, 523, .18], [.17, 659, .18], [.34, 784, .18], [.51, 1047, .48], [.68, 784, .16], [.85, 1047, .54]]
     .forEach(([delay, frequency, duration]) => tone(delay, frequency, duration, 'triangle', .065));
    break;
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

let isMuted = false;
let currentVoice = null;
let lastVoiceFile = null;
let userHasInteracted = false; // tracks browser autoplay unlock
let pendingVoice = null;       // queued voice waiting for interaction

// Called once on first user gesture to unlock browser autoplay
export const unlockAudio = () => {
  if (userHasInteracted) return;
  userHasInteracted = true;
  // Play and immediately pause a silent audio to unlock the browser context
  const unlock = new Audio('/audio/intro.mp3');
  unlock.volume = 0.001;
  unlock.play().then(() => {
    unlock.pause();
    unlock.currentTime = 0;
    // If there was a pending voice queued before unlock, play it now
    if (pendingVoice) {
      playVoice(pendingVoice);
      pendingVoice = null;
    }
  }).catch(() => {
    // If even that fails, just mark as interacted and hope for the best
  });
};

export const setMuted = (muted) => {
  isMuted = muted;
  if (!isMuted && lastVoiceFile) {
    playVoice(lastVoiceFile);
  } else if (isMuted && currentVoice) {
    currentVoice.pause();
    currentVoice.currentTime = 0;
  }
};

export const isAudioMuted = () => isMuted;

export const playVoice = (filename) => {
  lastVoiceFile = filename;

  if (currentVoice) {
    currentVoice.pause();
    currentVoice.currentTime = 0;
    currentVoice = null;
  }

  if (isMuted) return;

  if (!userHasInteracted) {
    // Queue it — will auto-play once unlocked on next gesture
    pendingVoice = filename;
    return;
  }

  const audio = new Audio(`/audio/${filename}`);
  currentVoice = audio;
  audio.play().catch(e => {
    console.warn(`Voice playback failed for ${filename}:`, e.message);
  });
};

export const stopVoice = () => {
  pendingVoice = null;
  if (currentVoice) {
    currentVoice.pause();
    currentVoice.currentTime = 0;
    currentVoice = null;
  }
};

const playSound = (name) => {
  if (isMuted || !userHasInteracted) return;
  const sfxPath = `/audio/${name}.mp3`;
  const a = new Audio(sfxPath);
  a.play().catch(() => {});
};

export const sounds = {
  tap:    () => playSound('tap'),
  correct: () => playSound('correct'),
  wrong:  () => playSound('wrong'),
  badge:  () => playSound('badge'),
};

import { useState, useCallback } from 'react';
import { Volume2, VolumeX, Home } from 'lucide-react';
import FloatingNumbers from './components/FloatingNumbers';
import IntroScreen from './components/IntroScreen';
import WonderPhase from './components/WonderPhase';
import StoryPhase from './components/StoryPhase';
import SimulatePhase from './components/SimulatePhase';
import PracticePhase from './components/PracticePhase';
import ReflectPhase from './components/ReflectPhase';
import { setMuted, isAudioMuted, stopVoice } from './utils/audio';

const JOURNEY_ITEMS = [
  { icon: '🔍', label: 'Wonder' },
  { icon: '📖', label: 'Story' },
  { icon: '🧪', label: 'Simulate' },
  { icon: '🎮', label: 'Practice' },
  { icon: '📓', label: 'Reflect' },
];

const JOURNEY_PHASES = ['wonder', 'story', 'simulate', 'practice', 'reflect'];

export default function App() {
  const [phase, setPhase] = useState('intro');
  const [isMutedState, setIsMutedState] = useState(isAudioMuted());

  const toggleMute = useCallback(() => {
    const newState = !isMutedState;
    setIsMutedState(newState);
    setMuted(newState);
  }, [isMutedState]);

  const goHome = useCallback(() => {
    stopVoice();
    setPhase('intro');
  }, []);

  const currentJourneyIdx = JOURNEY_PHASES.indexOf(phase);
  const showHomeBtn = phase !== 'intro';
  const showJourneyBar = phase !== 'intro';

  return (
    <>
      <FloatingNumbers />

      {/* Mute toggle */}
      <button
        className="audio-toggle-btn"
        onClick={toggleMute}
        id="audio-toggle"
        aria-label={isMutedState ? 'Unmute audio' : 'Mute audio'}
        title={isMutedState ? 'Unmute' : 'Mute'}
      >
        {isMutedState ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* Home button */}
      {showHomeBtn && (
        <button className="home-btn" onClick={goHome} id="home-btn" aria-label="Go to home">
          <Home size={16} /> Home
        </button>
      )}

      {/* Journey progress bar — now 5 phases */}
      {showJourneyBar && (
        <nav className="journey-bar" aria-label="Learning journey progress">
          {JOURNEY_ITEMS.map((item, idx) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center' }}>
              {idx > 0 && (
                <div className={`journey-connector${idx <= currentJourneyIdx ? ' filled' : ''}`} />
              )}
              <div
                className={`journey-step${idx === currentJourneyIdx ? ' active' : ''}${idx < currentJourneyIdx ? ' completed' : ''}`}
              >
                <div className="journey-step-dot">
                  {idx < currentJourneyIdx ? '✓' : item.icon}
                </div>
                <span className="journey-step-label">{item.label}</span>
              </div>
            </div>
          ))}
        </nav>
      )}

      {/* Main content */}
      <div className="app-container">
        {phase === 'intro' && (
          <IntroScreen onStart={() => setPhase('wonder')} />
        )}
        {phase === 'wonder' && (
          <WonderPhase onComplete={() => setPhase('story')} />
        )}
        {phase === 'story' && (
          <StoryPhase onComplete={() => setPhase('simulate')} />
        )}
        {phase === 'simulate' && (
          <SimulatePhase onComplete={() => setPhase('practice')} />
        )}
        {phase === 'practice' && (
          <PracticePhase onComplete={() => setPhase('reflect')} />
        )}
        {phase === 'reflect' && (
          <ReflectPhase onComplete={() => setPhase('intro')} />
        )}
      </div>
    </>
  );
}

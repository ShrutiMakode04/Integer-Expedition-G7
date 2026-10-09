import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { playVoice, unlockAudio } from '../utils/audio';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder',   desc: 'An integer mystery!' },
  { icon: '📖', label: 'Story',    desc: 'See integers in action' },
  { icon: '🧪', label: 'Simulate', desc: 'Explore interactively' },
  { icon: '🎮', label: 'Practice', desc: 'Gamified challenges' },
  { icon: '📓', label: 'Reflect',  desc: 'What did you learn?' },
];

export default function IntroScreen({ onStart }) {
  const [introStarted, setIntroStarted] = useState(false);

  const handleStartLearning = () => {
    unlockAudio();       // unlocks browser autoplay on first real gesture
    setIntroStarted(true);
    playVoice('intro.mp3');
  };

  return (
    <div className="intro-screen">
      {/* Curriculum badge */}
      <div className="intro-badge">
        ✨ Grade 7 · Numbers &amp; Number Sense
      </div>

      {/* Title */}
      <h1 className="intro-title">
        <span style={{ color: 'var(--gold)' }}>Integers</span>{' '}&amp;{' '}
        <span style={{ color: 'var(--coral)' }}>Rational Numbers</span>
      </h1>

      {/* Subtitle — enlarged and bolder */}
      <p className="intro-subtitle">
        Journey into the world of <strong style={{ color: 'var(--gold-light)' }}>positive</strong>,{' '}
        <strong style={{ color: '#64b5f6' }}>negative</strong>, and{' '}
        <strong style={{ color: 'var(--green-light)' }}>zero</strong> — unlock the secrets of integers,
        master rational numbers, and see how they power the real world around you!
      </p>

      {/* Speaker icon — below subtitle */}
      <div className="intro-speaker">
        <button className="intro-speaker-btn" id="intro-speaker-btn" aria-label="Audio narrator">
          <Volume2 size={18} />
          <span>Narration available</span>
        </button>
      </div>

      {/* Journey preview pills — all 5 phases */}
      <div className="intro-journey">
        {JOURNEY_PHASES.map((phase, i) => (
          <div key={phase.label} className="intro-phase-pill" style={{ animationDelay: `${0.35 + i * 0.08}s` }}>
            <span className="pill-icon">{phase.icon}</span>
            <span className="pill-label">{phase.label}</span>
            <span className="pill-desc">{phase.desc}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="intro-cta">
        {!introStarted ? (
          <button
            className="btn btn-primary btn-lg"
            onClick={handleStartLearning}
            id="start-learning-btn"
            style={{ animation: 'pulse 2s infinite' }}
          >
            Start Learning 🎧
          </button>
        ) : (
          <button
            className="btn btn-green btn-lg"
            onClick={onStart}
            id="begin-journey-btn"
            style={{ animation: 'popIn 0.5s ease both' }}
          >
            Begin Your Journey 🚀
          </button>
        )}
      </div>

    </div>
  );
}

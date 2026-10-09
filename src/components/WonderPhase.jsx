import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { playVoice } from '../utils/audio';

const WONDER_PAGES = [
  {
    emoji: '🌡️',
    question: 'Sarah looked at a thermometer outside. It showed -3°C. Inside it was +22°C.',
    subtext: 'How much WARMER is it inside than outside? And what kind of numbers are these mysterious negatives?',
    bgEmojis: ['🌡️', '❄️', '🔢', '➕', '➖', '📏'],
    facts: [
      { icon: '🏔️', text: 'Mt. Everest: +8,849 m above sea level' },
      { icon: '🌊', text: 'Dead Sea: −430 m below sea level' },
      { icon: '🏦', text: 'Bank: +$50 deposit | −$30 withdrawal' },
      { icon: '🏈', text: 'Football: +7 yards gained | −3 yards lost' },
    ],
    highlightBox: {
      color: '#64b5f6',
      text: 'Numbers that go below zero are called NEGATIVE INTEGERS. Numbers above zero are POSITIVE INTEGERS. Zero sits right in between!',
    },
  },
  {
    emoji: '½',
    question: 'Mike cut a pizza into 4 equal slices. He ate 3 slices. What fraction did he eat?',
    subtext: 'Is 3/4 a whole number? Can we place it on a number line between integers? Welcome to RATIONAL NUMBERS!',
    bgEmojis: ['½', '⅓', '¾', '⅔', '⅛', '📊'],
    facts: [
      { icon: '🍕', text: '3/4 of a pizza = rational number' },
      { icon: '💯', text: '75% = 75/100 = 3/4 — all rational!' },
      { icon: '📐', text: 'Between 0 and 1 live infinitely many rationals' },
      { icon: '🔢', text: 'Every integer is also a rational number (e.g. 5 = 5/1)' },
    ],
    highlightBox: {
      color: '#ff9800',
      text: 'A RATIONAL NUMBER is any number written as p/q, where p and q are integers and q ≠ 0. This includes all integers, fractions, and terminating or repeating decimals!',
    },
  },
];

export default function WonderPhase({ onComplete }) {
  const [pageIdx, setPageIdx] = useState(0);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState([]);

  const page = WONDER_PAGES[pageIdx];
  const isLastPage = pageIdx === WONDER_PAGES.length - 1;

  const particleData = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => ({
      id: i,
      emoji: page.bgEmojis[i % page.bgEmojis.length],
      x: Math.random() * 100,
      y: 80 + Math.random() * 20,
      delay: Math.random() * 8,
      dur: 10 + Math.random() * 15,
      tx: (Math.random() - 0.5) * 120,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIdx]);

  // Reset animation stages when page changes
  useEffect(() => {
    setStage(0);
    setParticles(particleData);
    playVoice(`wonder_${pageIdx + 1}.mp3`);
    
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1100);
    const t3 = setTimeout(() => setStage(3), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [particleData, pageIdx]);

  const goNext = () => {
    if (isLastPage) onComplete();
    else { setPageIdx(p => p + 1); }
  };

  const goPrev = () => {
    if (pageIdx > 0) setPageIdx(p => p - 1);
  };

  return (
    <div className="wonder-phase">
      {/* Particle background */}
      <div className="wonder-particles" aria-hidden="true">
        {particles.map(p => (
          <span
            key={p.id}
            className="wonder-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              '--dur': `${p.dur}s`,
              '--delay': `${p.delay}s`,
              '--tx': `${p.tx}px`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>

      <div className="wonder-card">
        {/* Page indicator */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px',
        }}>
          {WONDER_PAGES.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === pageIdx ? '28px' : '10px',
                height: '10px',
                borderRadius: '5px',
                background: i === pageIdx ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => setPageIdx(i)}
            />
          ))}
        </div>

        {/* Central emoji */}
        <span className="wonder-emoji" role="img" aria-label="wonder icon">
          {page.emoji}
        </span>

        {/* Question text */}
        <h2 className={`wonder-question${stage >= 1 ? ' visible' : ''}`}>
          {page.question}
        </h2>

        {/* Subtext */}
        <p className={`wonder-subtext${stage >= 2 ? ' visible' : ''}`}>
          {page.subtext}
        </p>

        {/* Number line — only on page 0 */}
        {pageIdx === 0 && (
          <div className={`wonder-numberline${stage >= 2 ? ' visible' : ''}`} aria-label="Number line from -10 to 10">
            <span className="nl-arrow">←</span>
            <div className="nl-track">
              <div className="nl-line">
                {[-10, -5, -3, 0, 5, 10, 22].map(n => (
                  <div
                    key={n}
                    className={`nl-tick${n < 0 ? ' negative' : n === 0 ? ' zero' : ' positive'}`}
                    style={{ left: `${((n + 10) / 32) * 100}%` }}
                  >
                    <div className="nl-tick-mark" />
                    <span className="nl-tick-label">{n > 0 ? `+${n}` : n}</span>
                  </div>
                ))}
              </div>
            </div>
            <span className="nl-arrow">→</span>
          </div>
        )}

        {/* Rational number line — page 1 */}
        {pageIdx === 1 && stage >= 2 && (
          <div className="wonder-numberline visible" style={{ marginBottom: '20px' }}>
            <span className="nl-arrow">←</span>
            <div className="nl-track">
              <div className="nl-line" style={{ width: '300px' }}>
                {[-1, -0.5, 0, 0.25, 0.5, 0.75, 1].map(n => (
                  <div
                    key={n}
                    className={`nl-tick${n < 0 ? ' negative' : n === 0 ? ' zero' : ' positive'}`}
                    style={{ left: `${((n + 1) / 2) * 100}%` }}
                  >
                    <div className="nl-tick-mark" />
                    <span className="nl-tick-label" style={{ fontSize: '0.65rem' }}>
                      {n === -0.5 ? '−½' : n === 0.25 ? '¼' : n === 0.5 ? '½' : n === 0.75 ? '¾' : n}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <span className="nl-arrow">→</span>
          </div>
        )}

        {/* Real-world facts */}
        {stage >= 2 && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px',
            marginBottom: '20px', textAlign: 'left',
          }}>
            {page.facts.map((fact, i) => (
              <div
                key={i}
                style={{
                  padding: '10px 14px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  animation: `fadeSlideUp 0.5s ${i * 0.12}s ease both`,
                }}
              >
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{fact.icon}</span>
                {fact.text}
              </div>
            ))}
          </div>
        )}

        {/* Highlight box */}
        {stage >= 2 && (
          <div style={{
            padding: '14px 18px', borderRadius: '12px', marginBottom: '24px',
            background: `${page.highlightBox.color}18`,
            border: `1px solid ${page.highlightBox.color}55`,
            borderLeft: `4px solid ${page.highlightBox.color}`,
            fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)',
            lineHeight: 1.6, textAlign: 'left',
            animation: 'fadeSlideUp 0.5s 0.5s ease both',
          }}>
            💡 {page.highlightBox.text}
          </div>
        )}

        {/* Navigation */}
        <div className={`wonder-cta${stage >= 3 ? ' visible' : ''}`}>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
            {pageIdx > 0 && (
              <button className="btn btn-outline btn-sm" onClick={goPrev} id="wonder-prev-btn">
                <ChevronLeft size={16} /> Back
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={goNext}
              id="wonder-continue-btn"
              aria-label={isLastPage ? 'Continue to Story phase' : 'Next wonder page'}
            >
              {isLastPage ? "I Wonder! Let's Explore →" : "Next →"}
              {!isLastPage && <ChevronRight size={16} />}
            </button>
          </div>
          <p style={{
            marginTop: '12px', fontSize: '0.78rem',
            color: 'var(--text-muted)', textAlign: 'center',
          }}>
            Page {pageIdx + 1} of {WONDER_PAGES.length}
          </p>
        </div>
      </div>
    </div>
  );
}

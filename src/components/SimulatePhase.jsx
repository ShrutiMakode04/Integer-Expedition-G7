import { useState, useCallback, useEffect, useRef } from 'react';
import { CheckCircle } from 'lucide-react';
import { sounds, playVoice } from '../utils/audio';

// ─── Station 1: Temperature Explorer ─────────────────────────────────────────
const TEMP_TASKS = [
  {
    title: 'Freezing Point',
    desc: 'Slide to the freezing point of water.',
    target: 0,
    hint: 'It is the boundary between positive and negative integers.'
  },
  {
    title: 'Winter Night',
    desc: 'Brrr! Slide to a freezing winter night temperature of -15°C.',
    target: -15,
    hint: 'Negative integers are below zero.'
  },
  {
    title: 'Sunny Day',
    desc: 'Now slide to a warm sunny day at +25°C.',
    target: 25,
    hint: 'Positive integers are above zero.'
  },
  {
    title: 'Temperature Drop',
    desc: 'From +25°C, the temperature drops by 30 degrees. Where are we now?',
    target: -5,
    hint: '25 - 30 = ?'
  }
];

function ThermometerStation({ onComplete, completed }) {
  const [temp, setTemp] = useState(10); // Start at 10 to force them to move to 0 for task 1
  const [taskIdx, setTaskIdx] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const task = TEMP_TASKS[taskIdx];
  const isDone = taskIdx >= TEMP_TASKS.length;

  const tempClass = temp < 0 ? 'temp-negative' : temp === 0 ? 'temp-zero' : 'temp-positive';
  const tempLabel = temp < 0 ? 'Negative Integer' : temp === 0 ? 'Zero' : 'Positive Integer';

  const handleSlide = (val) => {
    setTemp(Number(val));
    if (!feedback) sounds.tap();
  };

  const handleCheck = () => {
    if (feedback) return;
    if (temp === task.target) {
      sounds.correct();
      playVoice('feedback_correct.mp3');
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        setTaskIdx(i => i + 1);
      }, 1500);
    } else {
      sounds.wrong();
      playVoice('feedback_incorrect.mp3');
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  if (isDone) {
    return (
      <div className="station-workspace" style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '16px', animation: 'bounce 1.5s infinite' }}>🏆</div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '8px' }}>
          Temperature Master!
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
          You explored positive, negative, and zero temperatures perfectly!
        </p>
        <button className="btn btn-green btn-lg" onClick={onComplete} id="thermometer-complete-btn">
          <CheckCircle size={18} /> Station Complete! →
        </button>
      </div>
    );
  }

  const pct = (temp + 30) / 60;
  const fillHeight = Math.max(0, Math.min(1, pct)) * 140;
  const fillY = 30 + 140 - fillHeight;
  const fillColor = temp < 0 ? '#64b5f6' : temp === 0 ? '#ffc107' : '#ff7043';

  return (
    <div className="station-workspace">
      <h3 className="station-workspace-title">🌡️ Temperature Explorer</h3>
      <p className="station-workspace-desc">
        Drag the slider to set the temperature and solve the tasks!
      </p>

      {/* Task Card */}
      <div style={{
        padding: '16px 20px', borderRadius: '16px', marginBottom: '20px',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
        border: '1px solid rgba(255,255,255,0.1)',
        position: 'relative',
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
          Task {taskIdx + 1} of {TEMP_TASKS.length}: {task.title}
        </div>
        <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          {task.desc}
        </div>
      </div>

      <div className="thermometer-container" style={{ alignItems: 'center' }}>
        <div className="thermometer-svg-wrap">
          <svg width="80" height="220" viewBox="0 0 80 220" aria-label={`Thermometer showing ${temp}°C`}>
            <rect x="32" y="20" width="16" height="155" rx="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <rect x="36" y={fillY} width="8" height={fillHeight} rx="4" fill={fillColor} style={{ transition: 'all 0.2s ease' }} />
            <circle cx="40" cy="185" r="18" fill={fillColor} style={{ transition: 'fill 0.2s ease' }} />
            <circle cx="40" cy="185" r="12" fill="rgba(255,255,255,0.2)" />
            {[-30, -20, -10, 0, 10, 20, 30].map(t => {
              const y = 30 + (1 - (t + 30) / 60) * 140;
              return (
                <g key={t}>
                  <line x1="48" y1={y} x2="56" y2={y} stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                  <text x="60" y={y + 4} fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="600">
                    {t > 0 ? `+${t}` : t}
                  </text>
                </g>
              );
            })}
            <line x1="26" y1={fillY} x2="36" y2={fillY} stroke={fillColor} strokeWidth="2" style={{ transition: 'all 0.2s ease' }} />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, padding: '0 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div className={`temperature-display ${tempClass}`} aria-live="polite" style={{ fontSize: '3rem', margin: '0 auto 10px' }}>
              {temp > 0 ? `+${temp}` : temp}°C
            </div>
            <strong style={{ color: fillColor, fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {tempLabel}
            </strong>
          </div>

          <div className="temp-slider-wrap">
            <input
              type="range" className="temp-slider" min="-30" max="30" value={temp}
              onChange={e => handleSlide(e.target.value)}
              disabled={!!feedback}
              id="temp-slider" aria-label="Temperature slider"
            />
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
             <button 
               className="btn btn-primary btn-lg" 
               onClick={handleCheck}
               disabled={!!feedback}
               style={{ width: '100%', maxWidth: '250px' }}
             >
               Check Answer
             </button>
          </div>

          {feedback && (
            <div style={{
              padding: '12px', borderRadius: '12px', textAlign: 'center', fontWeight: 700,
              background: feedback === 'correct' ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)',
              color: feedback === 'correct' ? '#81c784' : '#ef9a9a',
              border: `1px solid ${feedback === 'correct' ? '#4caf50' : '#f44336'}`,
              animation: feedback === 'wrong' ? 'shake 0.4s ease' : 'popIn 0.3s ease',
            }}>
              {feedback === 'correct' ? '✓ Correct! Great job.' : `✗ Not quite. ${task.hint}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Station 2: Number Line Builder ──────────────────────────────────────────
const NL_NUMBERS = [-8, -4, -1, 0, 3, 6];
const NL_RANGE = { min: -10, max: 10 };

function NumberLineStation({ onComplete, completed }) {
  const [selected, setSelected] = useState(null);
  const [placed, setPlaced] = useState({});

  const totalPoints = Array.from({ length: (NL_RANGE.max - NL_RANGE.min) + 1 }, (_, i) => NL_RANGE.min + i);

  const handleChipClick = (n) => { sounds.tap(); setSelected(n); };

  const handlePointClick = (n) => {
    if (selected !== null && !NL_NUMBERS.find(x => placed[x] === n)) {
      sounds.correct();
      setPlaced(prev => ({ ...prev, [selected]: n }));
      setSelected(null);
    }
  };

  const placedCount = Object.keys(placed).length;
  const allPlaced = placedCount === NL_NUMBERS.length;

  const getPlacedNumberAt = (pos) => {
    return Object.entries(placed).find(([, v]) => v === pos)?.[0];
  };

  return (
    <div className="station-workspace">
      <h3 className="station-workspace-title">📏 Number Line Builder</h3>
      <p className="station-workspace-desc">
        Click a number chip below, then click the correct position on the number line to place it.
        Place all {NL_NUMBERS.length} numbers correctly!
      </p>

      <div className="nl-builder">
        <div className="nl-display">
          <div className="nl-full-line">
            <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>←</span>
            {totalPoints.map(n => {
              const placedHere = getPlacedNumberAt(n);
              const isTarget = NL_NUMBERS.includes(n);
              return (
                <div key={n} className="nl-segment" style={{ minWidth: '40px' }}>
                  <div className="nl-segment-line" />
                  <div
                    className={`nl-point${placedHere ? (Number(placedHere) === n ? ' placed' : '') : ''}${Number(placedHere) < 0 ? ' negative' : ''}`}
                    style={{
                      cursor: selected !== null && isTarget && !placedHere ? 'pointer' : 'default',
                      borderColor: selected !== null && isTarget && !placedHere ? 'var(--gold)' : undefined,
                      background: selected !== null && isTarget && !placedHere ? 'rgba(255,193,7,0.2)' : undefined,
                    }}
                    onClick={() => isTarget && !placedHere && handlePointClick(n)}
                    title={isTarget ? `Place number at ${n}` : undefined}
                  >
                    {placedHere && (
                      <span style={{
                        position: 'absolute', bottom: '18px', left: '50%',
                        transform: 'translateX(-50%)', fontSize: '0.7rem',
                        fontWeight: 800, whiteSpace: 'nowrap',
                        color: Number(placedHere) < 0 ? '#64b5f6' : 'var(--gold)',
                      }}>
                        {placedHere}
                      </span>
                    )}
                  </div>
                  {(n % 5 === 0 || n === NL_RANGE.min || n === NL_RANGE.max) && (
                    <span className="nl-segment-label" style={{ color: n < 0 ? '#64b5f6' : n === 0 ? 'var(--gold)' : 'var(--coral)' }}>
                      {n}
                    </span>
                  )}
                </div>
              );
            })}
            <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>→</span>
          </div>
        </div>

        <div className="nl-numbers-to-place">
          {NL_NUMBERS.map(n => {
            const isPlaced = n in placed;
            const isSelected = selected === n;
            return (
              <button
                key={n}
                className={`nl-number-chip${isSelected ? ' selected' : ''}${isPlaced ? ' placed' : ''}`}
                onClick={() => !isPlaced && handleChipClick(n)}
                disabled={isPlaced}
                id={`nl-chip-${n}`}
                aria-label={`Place ${n} on number line`}
                style={{ color: n < 0 ? '#64b5f6' : n === 0 ? 'var(--gold)' : 'var(--coral)' }}
              >
                {n > 0 ? `+${n}` : n}
              </button>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {placedCount} / {NL_NUMBERS.length} placed
          {selected !== null && <span style={{ color: 'var(--gold)', marginLeft: '12px' }}>
            Click a position on the number line for <strong>{selected > 0 ? `+${selected}` : selected}</strong>
          </span>}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {allPlaced ? (
          <button className="btn btn-green" onClick={onComplete} id="nl-complete-btn">
            <CheckCircle size={18} /> Station Complete!
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ─── Station 3: Fraction Visualizer ──────────────────────────────────────────
function FractionStation({ onComplete, completed }) {
  const [parts, setParts] = useState(4);
  const [shaded, setShaded] = useState(1);
  const [shape, setShape] = useState('circle');

  const handleSliceClick = (i) => { sounds.tap(); setShaded(i + 1); };

  const fraction = `${shaded}/${parts}`;
  const decimal = (shaded / parts).toFixed(3).replace(/\.?0+$/, '');

  const circleSlices = Array.from({ length: parts }, (_, i) => {
    const startAngle = (i / parts) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((i + 1) / parts) * 2 * Math.PI - Math.PI / 2;
    const r = 90; const cx = 100; const cy = 100;
    const x1 = cx + r * Math.cos(startAngle); const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);   const y2 = cy + r * Math.sin(endAngle);
    const largeArc = parts === 1 ? 1 : 0;
    const d = parts === 1
      ? `M ${cx} ${cy} m -${r} 0 a ${r} ${r} 0 1 1 ${2*r} 0 a ${r} ${r} 0 1 1 ${-2*r} 0`
      : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { d, filled: i < shaded };
  });

  const rectWidth = 300; const rectHeight = 80;

  return (
    <div className="station-workspace">
      <h3 className="station-workspace-title">½ Fraction Visualizer</h3>
      <p className="station-workspace-desc">
        Choose a shape and click slices to shade them. See how fractions represent parts of a whole!
      </p>

      <div className="fraction-viz">
        <div className="fraction-shape-row">
          {['circle', 'rectangle'].map(s => (
            <button
              key={s} className={`fraction-shape-btn${shape === s ? ' active' : ''}`}
              onClick={() => { setShape(s); sounds.tap(); }}
              id={`shape-btn-${s}`}
            >
              {s === 'circle' ? '⭕ Circle' : '▬ Rectangle'}
            </button>
          ))}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="fraction-parts-label">Parts:</span>
            {[2, 3, 4, 5, 6, 8, 10].map(n => (
              <button
                key={n}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%', border: '2px solid',
                  borderColor: parts === n ? 'var(--gold)' : 'rgba(255,255,255,0.15)',
                  background: parts === n ? 'rgba(255,193,7,0.2)' : 'transparent',
                  color: parts === n ? 'var(--gold)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-display)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                }}
                onClick={() => { setParts(n); setShaded(1); sounds.tap(); }}
                id={`parts-btn-${n}`}
              >{n}</button>
            ))}
          </div>
        </div>

        <div className="fraction-svg-container">
          {shape === 'circle' ? (
            <svg width="200" height="200" viewBox="0 0 200 200" className="fraction-svg">
              {circleSlices.map((sl, i) => (
                <path key={i} d={sl.d}
                  fill={sl.filled ? `hsl(${(i / parts) * 60 + 180}, 70%, 55%)` : 'rgba(255,255,255,0.06)'}
                  stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"
                  style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  onClick={() => handleSliceClick(i)}
                />
              ))}
            </svg>
          ) : (
            <svg width="340" height="100" viewBox="0 0 340 100" className="fraction-svg">
              {Array.from({ length: parts }, (_, i) => (
                <rect key={i}
                  x={20 + (i * rectWidth) / parts} y={10}
                  width={rectWidth / parts - 2} height={rectHeight}
                  fill={i < shaded ? `hsl(${(i / parts) * 60 + 200}, 70%, 55%)` : 'rgba(255,255,255,0.06)'}
                  stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" rx="4"
                  style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
                  onClick={() => handleSliceClick(i)}
                />
              ))}
            </svg>
          )}
        </div>

        <div className="fraction-result">
          <div className="fraction-result-number">{fraction}</div>
          <div className="fraction-result-label">
            <strong>{shaded}</strong> out of <strong>{parts}</strong> equal parts shaded
            <br />
            = {decimal} as a decimal
            {shaded === parts && ' = 1 whole'}
          </div>
        </div>

        <button className="btn btn-green" onClick={onComplete} id="fraction-complete-btn">
          <CheckCircle size={18} /> Station Complete!
        </button>
      </div>
    </div>
  );
}

// ─── Station 4: Comparing Numbers (Enhanced) ─────────────────────────────────
const COMPARE_PAIRS = [
  { a: '−3', b: '+5', correct: '<', aNum: -3, bNum: 5 },
  { a: '−½', b: '−¾', correct: '>', aNum: -0.5, bNum: -0.75 },
  { a: '0.5', b: '½', correct: '=', aNum: 0.5, bNum: 0.5 },
  { a: '−2', b: '−2.5', correct: '>', aNum: -2, bNum: -2.5 },
  { a: '¾', b: '0.8', correct: '<', aNum: 0.75, bNum: 0.8 },
  { a: '−10', b: '0', correct: '<', aNum: -10, bNum: 0 },
];

function CompareStation({ onComplete }) {
  const [pairIdx, setPairIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(0);
  const [shake, setShake] = useState(false);

  const pair = COMPARE_PAIRS[pairIdx];
  const isDone = pairIdx >= COMPARE_PAIRS.length;

  const handleSym = (sym) => {
    if (feedback) return;
    sounds.tap(); setSelected(sym);
    const isCorrect = sym === pair.correct;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) { sounds.correct(); playVoice('feedback_correct.mp3'); setCorrect(c => c + 1); }
    else { sounds.wrong(); playVoice('feedback_incorrect.mp3'); setShake(true); setTimeout(() => setShake(false), 600); }
    setTimeout(() => { setFeedback(null); setSelected(null); setPairIdx(i => i + 1); }, 1400);
  };

  if (isDone) {
    const pct = Math.round((correct / COMPARE_PAIRS.length) * 100);
    return (
      <div className="station-workspace" style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: '4.5rem', marginBottom: '16px', animation: 'bounce 1.5s infinite' }}>
          {correct === COMPARE_PAIRS.length ? '🏆' : correct >= 4 ? '⭐' : '💪'}
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '8px' }}>
          {correct === COMPARE_PAIRS.length ? 'Perfect Score!' : 'Well Done!'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '1.1rem' }}>
          You got <strong style={{ color: 'var(--gold)', fontSize: '1.4rem' }}>{correct}</strong> / {COMPARE_PAIRS.length} correct
        </p>
        <div style={{ display: 'inline-block', padding: '6px 20px', borderRadius: '999px', marginBottom: '28px',
          background: pct >= 80 ? 'rgba(76,175,80,0.2)' : 'rgba(255,152,0,0.2)',
          border: `1px solid ${pct >= 80 ? '#4caf50' : '#ff9800'}`,
          color: pct >= 80 ? '#81c784' : '#ffb74d', fontWeight: 700, fontSize: '0.95rem',
        }}>{pct}% Accuracy</div>
        <br />
        <button className="btn btn-green btn-lg" onClick={onComplete} id="compare-complete-btn">
          <CheckCircle size={18} /> Station Complete! →
        </button>
      </div>
    );
  }

  return (
    <div className="station-workspace">
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '6px' }}>⚖️ Comparing Numbers</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Which symbol makes it true? Use the number line to help!</p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
        {COMPARE_PAIRS.map((_, i) => (
          <div key={i} style={{
            width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.75rem', fontWeight: 700, transition: 'all 0.4s ease',
            background: i < pairIdx ? 'rgba(76,175,80,0.8)' : i === pairIdx ? 'rgba(255,193,7,0.8)' : 'rgba(255,255,255,0.08)',
            border: `2px solid ${i < pairIdx ? '#4caf50' : i === pairIdx ? '#ffc107' : 'rgba(255,255,255,0.15)'}`,
            color: i <= pairIdx ? '#fff' : 'var(--text-muted)', transform: i === pairIdx ? 'scale(1.2)' : 'scale(1)',
          }}>{i < pairIdx ? '✓' : i + 1}</div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
        <span style={{ color: '#64b5f6', fontSize: '0.75rem' }}>← Smaller</span>
        {[-3,-2,-1,0,1,2,3].map(n => (
          <div key={n} style={{
            width: '28px', height: '28px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: n < 0 ? 'rgba(100,181,246,0.15)' : n === 0 ? 'rgba(255,193,7,0.15)' : 'rgba(255,112,67,0.15)',
            border: `1px solid ${n < 0 ? '#64b5f6' : n === 0 ? '#ffc107' : '#ff7043'}44`,
            color: n < 0 ? '#64b5f6' : n === 0 ? '#ffc107' : '#ff7043', fontWeight: 700, fontSize: '0.7rem',
          }}>{n > 0 ? `+${n}` : n}</div>
        ))}
        <span style={{ color: '#ff7043', fontSize: '0.75rem' }}>Bigger →</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {[pair.a, null, pair.b].map((v, idx) => {
          if (v === null) return (
            <div key="slot" style={{
              width: '72px', height: '72px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.2rem', fontWeight: 900,
              background: feedback === 'correct' ? 'rgba(76,175,80,0.25)' : feedback === 'wrong' ? 'rgba(244,67,54,0.25)' : 'rgba(255,255,255,0.06)',
              border: `3px dashed ${feedback === 'correct' ? '#4caf50' : feedback === 'wrong' ? '#f44336' : 'rgba(255,255,255,0.2)'}`,
              color: feedback === 'correct' ? '#81c784' : feedback === 'wrong' ? '#ef9a9a' : 'var(--gold)', transition: 'all 0.3s',
            }}>{selected || '?'}</div>
          );
          const num = idx === 0 ? pair.aNum : pair.bNum;
          const color = num < 0 ? '#64b5f6' : num === 0 ? '#ffc107' : '#ff7043';
          return (
            <div key={idx} style={{
              width: '110px', height: '110px', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-display)',
              background: `${color}15`, border: `3px solid ${color}`, color, boxShadow: `0 0 24px ${color}88`,
              animation: shake && idx === 0 ? 'shake 0.4s ease' : 'none',
            }}>{v}</div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '20px' }}>
        {[{ sym: '<', label: 'Less than', color: '#64b5f6' }, { sym: '=', label: 'Equal', color: '#ffc107' }, { sym: '>', label: 'Greater', color: '#ff7043' }].map(({ sym, label, color }) => (
          <button key={sym} onClick={() => handleSym(sym)} disabled={!!feedback}
            id={`compare-sym-${sym === '<' ? 'lt' : sym === '>' ? 'gt' : 'eq'}`} aria-label={label}
            style={{
              width: '90px', height: '90px', borderRadius: '22px', fontSize: '2.8rem', fontWeight: 900, cursor: 'pointer',
              background: selected === sym ? (feedback === 'correct' ? 'rgba(76,175,80,0.3)' : 'rgba(244,67,54,0.3)') : `${color}18`,
              border: `3px solid ${selected === sym ? (feedback === 'correct' ? '#4caf50' : '#f44336') : color + '66'}`,
              color: selected === sym ? (feedback === 'correct' ? '#81c784' : '#ef9a9a') : color,
              transition: 'all 0.2s', transform: selected === sym ? 'scale(1.08)' : 'scale(1)', boxShadow: `0 6px 20px ${color}33`,
            }}>{sym}</button>
        ))}
      </div>
      {feedback && (
        <div style={{
          textAlign: 'center', padding: '14px 24px', borderRadius: '16px', marginTop: '8px',
          background: feedback === 'correct' ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)',
          border: `1px solid ${feedback === 'correct' ? '#4caf50' : '#f44336'}`,
          color: feedback === 'correct' ? '#81c784' : '#ef9a9a', fontSize: '1rem', fontWeight: 700, animation: 'popIn 0.3s ease',
        }} aria-live="polite">
          {feedback === 'correct' ? `✓ Correct! ${pair.a} ${pair.correct} ${pair.b}` : `✗ Not quite. The answer is ${pair.a} ${pair.correct} ${pair.b}`}
        </div>
      )}
    </div>
  );
}

// ─── Station 5: Integer Hopper Simulation ────────────────────────────────────
// A frog hops on a live number line. Students pick operation cards and watch
// the frog jump, discovering how integer addition/subtraction works visually.

const HOPPER_CHALLENGES = [
  {
    title: 'Reach +5',
    startPos: 0,
    target: 5,
    moves: 4,
    hint: 'Use positive cards to hop right!',
    cards: ['+3', '+2', '+5', '-1', '+4', '-2'],
  },
  {
    title: 'Reach -4',
    startPos: 2,
    target: -4,
    moves: 3,
    hint: 'Negative cards hop left!',
    cards: ['-3', '-5', '-2', '+1', '-6', '+2'],
  },
  {
    title: 'Reach 0',
    startPos: -6,
    target: 0,
    moves: 3,
    hint: 'Get back to zero — the origin!',
    cards: ['+2', '+4', '-1', '+6', '+3', '-3'],
  },
];

const NL_MIN = -12;
const NL_MAX = 12;
const NL_TOTAL = NL_MAX - NL_MIN;

function IntegerHopperStation({ onComplete }) {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [pos, setPos] = useState(HOPPER_CHALLENGES[0].startPos);
  const [movesLeft, setMovesLeft] = useState(HOPPER_CHALLENGES[0].moves);
  const [history, setHistory] = useState([]);
  const [jumping, setJumping] = useState(false);
  const [lastCard, setLastCard] = useState(null);
  const [phase, setPhase] = useState('play'); // 'play' | 'success' | 'fail'
  const [completedCount, setCompletedCount] = useState(0);
  const [shuffledCards, setShuffledCards] = useState(() =>
    [...HOPPER_CHALLENGES[0].cards].sort(() => Math.random() - 0.5)
  );

  const challenge = HOPPER_CHALLENGES[challengeIdx];

  const lineW = 560;
  const toX = (n) => ((n - NL_MIN) / NL_TOTAL) * lineW;
  const frogX = toX(pos);
  const targetX = toX(challenge.target);
  const startX = toX(challenge.startPos);

  const handleCard = (card) => {
    if (jumping || phase !== 'play' || movesLeft <= 0) return;
    const delta = parseInt(card, 10);
    const newPos = Math.max(NL_MIN, Math.min(NL_MAX, pos + delta));

    sounds.tap();
    setJumping(true);
    setLastCard(card);
    setHistory(prev => [...prev, { from: pos, card, to: newPos }]);
    setPos(newPos);

    setTimeout(() => {
      setJumping(false);
      const newMovesLeft = movesLeft - 1;
      setMovesLeft(newMovesLeft);

      if (newPos === challenge.target) {
        sounds.correct();
        playVoice('feedback_correct.mp3');
        setPhase('success');
        setCompletedCount(c => c + 1);
      } else if (newMovesLeft <= 0) {
        sounds.wrong();
        playVoice('feedback_incorrect.mp3');
        setPhase('fail');
      }
    }, 600);
  };

  const resetChallenge = () => {
    setPos(challenge.startPos);
    setMovesLeft(challenge.moves);
    setHistory([]);
    setLastCard(null);
    setPhase('play');
    setShuffledCards([...challenge.cards].sort(() => Math.random() - 0.5));
  };

  const nextChallenge = () => {
    const nextIdx = challengeIdx + 1;
    if (nextIdx >= HOPPER_CHALLENGES.length) { onComplete(); return; }
    setChallengeIdx(nextIdx);
    const next = HOPPER_CHALLENGES[nextIdx];
    setPos(next.startPos);
    setMovesLeft(next.moves);
    setHistory([]);
    setLastCard(null);
    setPhase('play');
    setShuffledCards([...next.cards].sort(() => Math.random() - 0.5));
  };

  const ticks = Array.from({ length: NL_TOTAL + 1 }, (_, i) => NL_MIN + i);

  return (
    <div className="station-workspace">
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '4px' }}>
          🐸 Integer Hopper
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Pick a card to hop the frog on the number line. Land exactly on the target!
        </p>
      </div>

      {/* Challenge progress */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
        {HOPPER_CHALLENGES.map((ch, i) => (
          <div key={i} style={{
            padding: '4px 14px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
            background: i < challengeIdx ? 'rgba(76,175,80,0.2)' : i === challengeIdx ? 'rgba(255,193,7,0.2)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${i < challengeIdx ? '#4caf50' : i === challengeIdx ? '#ffc107' : 'rgba(255,255,255,0.1)'}`,
            color: i < challengeIdx ? '#81c784' : i === challengeIdx ? '#ffc107' : 'var(--text-muted)',
          }}>
            {i < challengeIdx ? '✓ ' : ''}{ch.title}
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px', borderRadius: '16px', marginBottom: '20px',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Position</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: pos < 0 ? '#64b5f6' : pos === 0 ? '#ffc107' : '#ff7043' }}>
            {pos > 0 ? `+${pos}` : pos}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Target</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: '#ffd54f' }}>
            🎯 {challenge.target > 0 ? `+${challenge.target}` : challenge.target}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>Hops left</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: movesLeft <= 1 ? '#ef9a9a' : '#81c784' }}>
            {'🐸'.repeat(movesLeft)}
          </div>
        </div>
      </div>

      {/* Live Number Line SVG */}
      <div style={{ overflowX: 'auto', padding: '12px 0', marginBottom: '16px' }}>
        <svg width={lineW + 80} height="120" viewBox={`-40 0 ${lineW + 80} 120`} style={{ display: 'block', margin: '0 auto' }}>
          {/* Main axis */}
          <line x1="0" y1="60" x2={lineW} y2="60" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
          <polygon points={`${lineW},55 ${lineW+14},60 ${lineW},65`} fill="rgba(255,255,255,0.25)" />
          <polygon points="0,55 -14,60 0,65" fill="rgba(255,255,255,0.25)" />

          {/* Tick marks */}
          {ticks.map(t => {
            const x = toX(t);
            const isMajor = t % 2 === 0;
            const col = t < 0 ? '#64b5f6' : t === 0 ? '#ffc107' : '#ff7043';
            return (
              <g key={t}>
                <line x1={x} y1={60 - (isMajor ? 10 : 5)} x2={x} y2={60 + (isMajor ? 10 : 5)}
                  stroke={col} strokeWidth={isMajor ? 2 : 1} opacity={isMajor ? 0.8 : 0.3} />
                {isMajor && (
                  <text x={x} y="84" textAnchor="middle" fill={col} fontSize="9" fontWeight="700"
                    opacity="0.8">
                    {t > 0 ? `+${t}` : t}
                  </text>
                )}
              </g>
            );
          })}

          {/* Start marker */}
          <circle cx={startX} cy={60} r="6" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x={startX} y="28" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9">START</text>

          {/* Target marker (pulsing star) */}
          <circle cx={targetX} cy={60} r="14" fill="rgba(255,213,79,0.15)" stroke="#ffd54f" strokeWidth="2"
            style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
          <text x={targetX} y="64" textAnchor="middle" fontSize="14">🎯</text>
          <text x={targetX} y="18" textAnchor="middle" fill="#ffd54f" fontSize="9" fontWeight="700">TARGET</text>

          {/* Jump arc — show last hop */}
          {history.length > 0 && (() => {
            const last = history[history.length - 1];
            const x1 = toX(last.from); const x2 = toX(last.to);
            const mid = (x1 + x2) / 2;
            const arcH = Math.abs(x2 - x1) * 0.4 + 20;
            const isPos = last.to > last.from;
            return (
              <path d={`M ${x1} 60 Q ${mid} ${60 - arcH} ${x2} 60`}
                fill="none" stroke={isPos ? '#ff7043' : '#64b5f6'}
                strokeWidth="2" strokeDasharray="5,3" opacity="0.6" />
            );
          })()}

          {/* Frog */}
          <g style={{ transition: 'transform 0.5s cubic-bezier(.34,1.56,.64,1)', transform: `translateX(${frogX}px)` }}>
            <text x="0" y="58" textAnchor="middle" fontSize="26"
              style={{ animation: jumping ? 'bounce 0.5s ease' : 'none' }}>
              🐸
            </text>
          </g>
        </svg>
      </div>

      {/* Last hop info */}
      {lastCard && (
        <div style={{
          textAlign: 'center', marginBottom: '12px', fontSize: '0.9rem',
          color: parseInt(lastCard) > 0 ? '#ff7043' : '#64b5f6', fontWeight: 700,
        }}>
          {parseInt(lastCard) > 0 ? '→' : '←'} Hopped {lastCard} → landed on {pos > 0 ? `+${pos}` : pos}
        </div>
      )}

      {/* Cards */}
      {phase === 'play' && (
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
          {shuffledCards.map((card, i) => {
            const val = parseInt(card, 10);
            const color = val > 0 ? '#ff7043' : '#64b5f6';
            return (
              <button key={i} onClick={() => handleCard(card)}
                disabled={jumping || movesLeft <= 0}
                id={`hop-card-${i}`}
                style={{
                  width: '70px', height: '80px', borderRadius: '18px',
                  fontSize: '1.3rem', fontWeight: 900, fontFamily: 'var(--font-display)',
                  background: `${color}18`, border: `2px solid ${color}66`, color,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: `0 4px 14px ${color}33`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px',
                }}
              >
                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{val > 0 ? '→' : '←'}</span>
                {card}
              </button>
            );
          })}
        </div>
      )}

      {/* Hint */}
      {phase === 'play' && (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          💡 {challenge.hint}
        </p>
      )}

      {/* Outcome */}
      {phase === 'success' && (
        <div style={{ textAlign: 'center', animation: 'popIn 0.4s ease' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🎉</div>
          <p style={{ color: '#81c784', fontWeight: 700, fontSize: '1.1rem', marginBottom: '16px' }}>
            You landed on {challenge.target}! Perfect hop!
          </p>
          <button className="btn btn-primary" onClick={nextChallenge} id="hopper-next-btn">
            {challengeIdx + 1 >= HOPPER_CHALLENGES.length ? (
              <><CheckCircle size={18} /> Complete Station!</>
            ) : 'Next Challenge →'}
          </button>
        </div>
      )}

      {phase === 'fail' && (
        <div style={{ textAlign: 'center', animation: 'popIn 0.4s ease' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>😅</div>
          <p style={{ color: '#ef9a9a', fontWeight: 700, marginBottom: '8px' }}>
            Landed on {pos > 0 ? `+${pos}` : pos}, needed {challenge.target}. Try again!
          </p>
          <button className="btn btn-outline" onClick={resetChallenge} id="hopper-retry-btn">
            🔄 Try Again
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main SimulatePhase ───────────────────────────────────────────────────────
const STATIONS = [
  { id: 0, icon: '🌡️', name: 'Temperature Explorer', desc: 'Integers on a thermometer' },
  { id: 1, icon: '📏', name: 'Number Line Builder',   desc: 'Place numbers on a line' },
  { id: 2, icon: '½',  name: 'Fraction Visualizer',   desc: 'See rational numbers' },
  { id: 3, icon: '⚖️', name: 'Comparing Numbers',     desc: 'Use <, =, > symbols' },
  { id: 4, icon: '🐸', name: 'Integer Hopper',         desc: 'Hop on the number line!' },
];

export default function SimulatePhase({ onComplete }) {
  const [activeStation, setActiveStation] = useState(null);
  const [completedStations, setCompletedStations] = useState(new Set());

  const handleStationComplete = useCallback((stationId) => {
    sounds.badge();
    setCompletedStations(prev => new Set([...prev, stationId]));
    setActiveStation(null);
  }, []);

  useEffect(() => {
    playVoice('sim_intro.mp3');
  }, []);

  useEffect(() => {
    if (activeStation !== null) {
      playVoice(`sim_station_${activeStation}.mp3`);
    }
  }, [activeStation]);

  const allDone = completedStations.size === STATIONS.length;

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h2 className="simulate-title">
          🧪 <span style={{ color: 'var(--gold)' }}>Simulation</span> Lab
        </h2>
        <p className="simulate-subtitle">
          Complete all 5 stations to master Integers &amp; Rational Numbers!
          ({completedStations.size}/{STATIONS.length} done)
        </p>
      </div>

      <div className="stations-grid">
        {STATIONS.map(st => (
          <button
            key={st.id}
            className={`station-card${activeStation === st.id ? ' active' : ''}${completedStations.has(st.id) ? ' completed' : ''}`}
            onClick={() => { setActiveStation(st.id); sounds.tap(); }}
            id={`station-card-${st.id}`}
            aria-label={`Open ${st.name} station`}
          >
            <span className="station-icon">{st.icon}</span>
            <span className="station-name">{st.name}</span>
            <span className="station-desc">{st.desc}</span>
            {completedStations.has(st.id) && <span style={{ fontSize: '0.85rem', color: '#81c784', fontWeight: 700 }}>✓ Done</span>}
          </button>
        ))}
      </div>

      {activeStation === 0 && <ThermometerStation  onComplete={() => handleStationComplete(0)} completed={completedStations.has(0)} />}
      {activeStation === 1 && <NumberLineStation   onComplete={() => handleStationComplete(1)} completed={completedStations.has(1)} />}
      {activeStation === 2 && <FractionStation     onComplete={() => handleStationComplete(2)} completed={completedStations.has(2)} />}
      {activeStation === 3 && <CompareStation       onComplete={() => handleStationComplete(3)} />}
      {activeStation === 4 && <IntegerHopperStation onComplete={() => handleStationComplete(4)} />}

      {allDone && (
        <div style={{ textAlign: 'center', marginTop: '32px', animation: 'popIn 0.5s ease both' }}>
          <p style={{ color: 'var(--green-light)', fontWeight: 700, marginBottom: '16px', fontSize: '1.1rem' }}>
            🎉 All stations complete! You are ready to practice!
          </p>
          <button className="btn btn-primary btn-lg" onClick={onComplete} id="simulate-complete-btn">
            Start Practice! 🎮
          </button>
        </div>
      )}

      {!allDone && (
        <div style={{ textAlign: 'center', marginTop: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Complete all {STATIONS.length} stations to unlock Practice 🔒
        </div>
      )}
    </div>
  );
}

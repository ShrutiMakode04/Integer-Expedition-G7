import { useState, useMemo, useCallback, useEffect } from 'react';
import { generateSessionQuestions } from '../utils/questionBank';
import { sounds, playVoice } from '../utils/audio';

const WORLDS = [
  { id: 0, name: 'Integer Basics',       icon: '🔢', color: '#ff4081', desc: 'Q 1–10' },
  { id: 1, name: 'Positive & Negative',  icon: '➕', color: '#4caf50', desc: 'Q 11–20' },
  { id: 2, name: 'Number Line Pro',      icon: '📏', color: '#03a9f4', desc: 'Q 21–30' },
  { id: 3, name: 'Rational Explorer',    icon: '½',  color: '#ff9800', desc: 'Q 31–40' },
  { id: 4, name: 'Compare & Order',      icon: '⚖️', color: '#9c27b0', desc: 'Q 41–50' },
  { id: 5, name: 'Integer Operations',   icon: '➗', color: '#00bcd4', desc: 'Q 51–60' },
  { id: 6, name: 'Word Problem Solver',  icon: '📝', color: '#ff5722', desc: 'Q 61–70' },
  { id: 7, name: 'Master Challenge',     icon: '🏆', color: '#673ab7', desc: 'Q 71–80' },
];

function calcStars(correct, total) {
  const pct = correct / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

function calcXP(correct, total) {
  return correct * 10 + (correct === total ? 20 : 0);
}

const LETTERS = ['A', 'B', 'C', 'D'];

// ── Question card renderer ──────────────────────────────────────────────────
function QuestionCard({ q, qIndex, total, lives, score, streak, onAnswer }) {
  const [answered, setAnswered] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const handleOption = useCallback((optIdx) => {
    if (answered !== null) return;
    sounds.tap();
    const isCorrect = optIdx === q.correct;
    setAnswered(optIdx);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      sounds.correct();
      playVoice('feedback_correct.mp3');
    } else {
      sounds.wrong();
      playVoice('feedback_incorrect.mp3');
    }
    setTimeout(() => {
      onAnswer(isCorrect);
      setAnswered(null);
      setFeedback(null);
    }, 1100);
  }, [answered, q.correct, onAnswer]);

  return (
    <div className="question-screen">
      {/* HUD */}
      <div className="hud">
        <div className="hud-item">
          <span className="heart">{'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}</span>
        </div>
        <div className="hud-item">
          <span className="xp">⚡ {score * 10} XP</span>
        </div>
        <div className="hud-item">
          <span className="streak">🔥 {streak}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-container" style={{ width: '100%', maxWidth: '700px', marginBottom: '12px' }}>
        <div className="progress-bar-label">
          <span>Question {qIndex + 1}</span>
          <span>{qIndex + 1} / {total}</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${((qIndex + 1) / total) * 100}%` }} />
        </div>
      </div>

      {/* Question box */}
      <div className="question-box">
        <div className="question-badge">
          {q.type === 'mcq' && '🔵 Multiple Choice'}
          {q.type === 'tf' && '✅ True or False'}
          {q.type === 'fill' && '📝 Fill in the Blank'}
          {q.type === 'word' && '📖 Word Problem'}
          {q.type === 'order' && '🔢 Order Numbers'}
          {q.type === 'compare' && '⚖️ Compare'}
          {q.type === 'id' && '🔍 Identify'}
          {q.type === 'compute' && '🧮 Compute'}
        </div>

        <div className="question-text" id={`question-text-${qIndex}`}>
          {q.question}
        </div>

        <div className={`options-grid${q.options.length === 2 ? ' two-col' : ''}`}
          style={q.options.length === 2 ? { gridTemplateColumns: '1fr 1fr' } : {}}>
          {q.options.map((opt, i) => {
            let cls = 'option-btn';
            if (answered !== null) {
              if (i === q.correct) cls += ' correct';
              else if (i === answered && answered !== q.correct) cls += ' wrong';
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => handleOption(i)}
                disabled={answered !== null}
                id={`option-${qIndex}-${i}`}
                aria-label={`Option ${LETTERS[i]}: ${opt}`}
              >
                <span className="option-letter">{LETTERS[i]}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`feedback-bar ${feedback}`} aria-live="polite">
            {feedback === 'correct'
              ? `✓ Correct! ${q.explanation}`
              : `✗ Not quite. ${q.explanation}`}
          </div>
        )}
      </div>
    </div>
  );
}

// ── World complete screen ───────────────────────────────────────────────────
function WorldComplete({ world, score, total, xp, stars, onBack, onNext, isLast }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px 40px' }}>
      <div className="world-complete">
        <div className="world-complete-icon">{world.icon}</div>
        <h2 className="world-complete-title">{world.name}</h2>
        <div className="world-complete-stars">
          {[1, 2, 3].map(s => (
            <span key={s} style={{ filter: s <= stars ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
          ))}
        </div>
        <p className="world-complete-score">
          {score} / {total} correct · +{xp} XP
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {stars === 3 && '🔥 Perfect score! You are a master!'}
          {stars === 2 && '👏 Great work! Keep practising!'}
          {stars === 1 && '💪 Good effort! Try again for more stars!'}
          {stars === 0 && '📚 Review the topic and try again!'}
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-outline btn-sm" onClick={onBack} id="back-to-map-btn">
            ← Back to Map
          </button>
          {!isLast && (
            <button className="btn btn-primary btn-sm" onClick={onNext} id="next-card-btn">
              Next Card →
            </button>
          )}
          {isLast && (
            <button className="btn btn-green" onClick={onNext} id="finish-all-btn">
              🏆 Finish Practice!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Final summary ───────────────────────────────────────────────────────────
function FinalSummary({ worldResults, totalXP, onRestart, onHome }) {
  const totalCorrect = Object.values(worldResults).reduce((s, r) => s + r.score, 0);
  const totalQ = Object.values(worldResults).reduce((s, r) => s + r.total, 0);
  const avgStars = (Object.values(worldResults).reduce((s, r) => s + r.stars, 0) / Math.max(1, Object.keys(worldResults).length)).toFixed(1);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px' }}>
      <div className="glass-card" style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px', animation: 'bounce 2s infinite' }}>🏆</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '8px' }}>
          Practice Complete!
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px' }}>
          You completed all 8 cards of Integers &amp; Rational Numbers!
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Questions', value: `${totalCorrect}/${totalQ}`, icon: '🎯' },
            { label: 'Total XP', value: totalXP, icon: '⚡' },
            { label: 'Avg Stars', value: `${avgStars} ⭐`, icon: '🌟' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{
              padding: '16px 12px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{icon}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700 }}>{value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Card results */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '28px' }}>
          {WORLDS.map(w => {
            const r = worldResults[w.id];
            return (
              <div key={w.id} style={{
                padding: '10px 6px', borderRadius: '12px', textAlign: 'center',
                background: r ? `${w.color}18` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${r ? w.color + '44' : 'rgba(255,255,255,0.08)'}`,
              }}>
                <div style={{ fontSize: '1.4rem' }}>{w.icon}</div>
                {r ? (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {r.score}/{r.total}<br />
                    {'⭐'.repeat(r.stars)}{'☆'.repeat(3 - r.stars)}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>—</div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-outline btn-sm" onClick={onRestart} id="restart-practice-btn">
            🔄 Practice Again
          </button>
          <button className="btn btn-primary" onClick={onHome} id="go-home-btn">
            🏠 Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main PracticePhase ──────────────────────────────────────────────────────
export default function PracticePhase({ onComplete }) {
  const allQuestions = useMemo(() => generateSessionQuestions(), []);

  const [currentWorld, setCurrentWorld] = useState(-1); // -1 = map view
  const [worldResults, setWorldResults] = useState({});
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [worldComplete, setWorldComplete] = useState(false);
  const [xpPopup, setXpPopup] = useState(null);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    playVoice('practice_intro.mp3');
  }, []);

  const worldQuestions = useMemo(
    () => allQuestions.filter(q => q.world === currentWorld),
    [allQuestions, currentWorld]
  );

  const q = worldQuestions[qIndex];

  const startWorld = useCallback((worldId) => {
    sounds.tap();
    setCurrentWorld(worldId);
    setQIndex(0);
    setScore(0);
    setLives(3);
    setStreak(0);
    setWorldComplete(false);
  }, []);

  const handleAnswer = useCallback((isCorrect) => {
    if (isCorrect) {
      const newScore = score + 1;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      const xp = 10 + (newStreak >= 3 ? 5 : 0);
      setTotalXP(t => t + xp);
      setXpPopup(`+${xp} XP`);
      setTimeout(() => setXpPopup(null), 1200);

      const nextIdx = qIndex + 1;
      if (nextIdx >= worldQuestions.length) {
        const stars = calcStars(newScore, worldQuestions.length);
        const earned = calcXP(newScore, worldQuestions.length);
        sounds.badge();
        setWorldResults(prev => ({
          ...prev,
          [currentWorld]: { score: newScore, total: worldQuestions.length, stars, xp: earned },
        }));
        setWorldComplete(true);
      } else {
        setQIndex(nextIdx);
      }
    } else {
      setStreak(0);
      const newLives = lives - 1;
      setLives(newLives);
      const nextIdx = qIndex + 1;
      if (nextIdx >= worldQuestions.length || newLives <= 0) {
        const stars = calcStars(score, worldQuestions.length);
        const earned = calcXP(score, worldQuestions.length);
        sounds.badge();
        setWorldResults(prev => ({
          ...prev,
          [currentWorld]: { score, total: worldQuestions.length, stars, xp: earned },
        }));
        setWorldComplete(true);
      } else {
        setQIndex(nextIdx);
      }
    }
  }, [score, streak, qIndex, worldQuestions.length, lives, currentWorld]);

  const backToMap = useCallback(() => {
    setCurrentWorld(-1);
    setWorldComplete(false);
  }, []);

  const goNextCard = useCallback(() => {
    const nextWorldId = currentWorld + 1;
    if (nextWorldId >= WORLDS.length) {
      setShowFinal(true);
    } else {
      startWorld(nextWorldId);
    }
  }, [currentWorld, startWorld]);

  // Final summary
  if (showFinal) {
    return (
      <FinalSummary
        worldResults={worldResults}
        totalXP={totalXP}
        onRestart={() => { setShowFinal(false); setCurrentWorld(-1); setWorldResults({}); setTotalXP(0); }}
        onHome={onComplete}
      />
    );
  }

  // World complete screen
  if (worldComplete && currentWorld >= 0) {
    const r = worldResults[currentWorld] || { score, total: worldQuestions.length, stars: 0 };
    return (
      <WorldComplete
        world={WORLDS[currentWorld]}
        score={r.score}
        total={r.total}
        xp={r.xp || 0}
        stars={r.stars}
        onBack={backToMap}
        onNext={goNextCard}
        isLast={currentWorld === WORLDS.length - 1}
      />
    );
  }

  // Active question
  if (currentWorld >= 0 && q) {
    return (
      <>
        {xpPopup && <div className="xp-popup" aria-live="polite">{xpPopup}</div>}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px 40px' }}>
          <QuestionCard
            key={qIndex}
            q={q}
            qIndex={qIndex}
            total={worldQuestions.length}
            lives={lives}
            score={score}
            streak={streak}
            onAnswer={handleAnswer}
          />
        </div>
      </>
    );
  }

  // Card map view
  return (
    <div className="practice-phase">
      <div className="practice-header">
        <h2 className="practice-title">
          🎮 <span style={{ color: 'var(--gold)' }}>Practice</span> Arena
        </h2>
        <p className="practice-subtitle">
          Choose a card to start · 10 questions per card · 8 cards total
        </p>
        {totalXP > 0 && (
          <p style={{ color: 'var(--gold)', fontWeight: 700, marginTop: '8px' }}>
            ⚡ Total XP: {totalXP}
          </p>
        )}
      </div>

      <div className="cards-grid">
        {WORLDS.map((world, idx) => {
          const result = worldResults[world.id];
          const isUnlocked = idx === 0 || worldResults[idx - 1] !== undefined;

          return (
            <button
              key={world.id}
              className={`world-card${result ? ' completed' : ''}${!isUnlocked ? ' locked' : ''}`}
              style={{ '--card-color': world.color }}
              onClick={() => isUnlocked && startWorld(world.id)}
              disabled={!isUnlocked}
              id={`world-card-${world.id}`}
              aria-label={`${world.name} — ${world.desc}`}
            >
              <span className="world-icon">{world.icon}</span>
              <span className="world-name">{world.name}</span>
              <span className="world-desc">{world.desc}</span>
              {result ? (
                <div className="world-stars">
                  {[1, 2, 3].map(s => (
                    <span key={s} className={`star${s <= result.stars ? ' earned' : ''}`}>⭐</span>
                  ))}
                </div>
              ) : !isUnlocked ? (
                <span style={{ fontSize: '1.2rem' }}>🔒</span>
              ) : (
                <span style={{ fontSize: '0.75rem', color: world.color, fontWeight: 700 }}>
                  START
                </span>
              )}
            </button>
          );
        })}
      </div>

      {Object.keys(worldResults).length === WORLDS.length && (
        <button
          className="btn btn-green btn-lg"
          onClick={() => setShowFinal(true)}
          id="see-results-btn"
        >
          🏆 See Final Results
        </button>
      )}
    </div>
  );
}

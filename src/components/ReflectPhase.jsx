import { useState, useEffect } from 'react';
import { playVoice } from '../utils/audio';

const KEY_CONCEPTS = [
  {
    icon: '🔢',
    title: 'What are Integers?',
    color: '#64b5f6',
    points: [
      'Integers include all whole numbers: …−3, −2, −1, 0, +1, +2, +3…',
      'Negative integers are below zero (−1, −2, …)',
      'Positive integers are above zero (+1, +2, …)',
      'Zero (0) is neither positive nor negative',
    ],
  },
  {
    icon: '📏',
    title: 'The Number Line',
    color: '#ff7043',
    points: [
      'Integers are evenly spaced on the number line',
      'Values increase from LEFT → RIGHT',
      'Left of zero = negative, Right of zero = positive',
      'Every integer is a unique point on the line',
    ],
  },
  {
    icon: '½',
    title: 'Rational Numbers',
    color: '#ff9800',
    points: [
      'A rational number is any number written as p/q (q ≠ 0)',
      'Includes all integers, fractions, and terminating/repeating decimals',
      'Examples: −3/4, 0.5, 2/3, −5, 7',
      'Every integer IS a rational number (e.g. 5 = 5/1)',
    ],
  },
  {
    icon: '⚖️',
    title: 'Comparing & Ordering',
    color: '#9c27b0',
    points: [
      'Use the number line: further left = smaller value',
      'Convert fractions to decimals for easy comparison',
      'Negative fractions are still negative (−½ > −5)',
      'Order from least to greatest = left to right on number line',
    ],
  },
  {
    icon: '🌍',
    title: 'Real World Connections',
    color: '#4caf50',
    points: [
      'Temperature: −3°C (below freezing), +22°C (warm day)',
      'Finance: +$50 deposit, −$30 withdrawal',
      'Geography: +8,849m (Mt. Everest), −430m (Dead Sea)',
      'Sports: +7 yards gained, −3 yards lost',
    ],
  },
];

const REFLECT_QUESTIONS = [
  { id: 'q1', label: 'One thing I learned today that surprised me:', emoji: '😮' },
  { id: 'q2', label: 'One real-world example of integers I can think of:', emoji: '🌍' },
  { id: 'q3', label: 'One thing I still want to understand better:', emoji: '🤔' },
];

const SELF_CHECKS = [
  { id: 's1', text: 'I can explain what a negative integer is' },
  { id: 's2', text: 'I can place integers and fractions on a number line' },
  { id: 's3', text: 'I can compare two rational numbers using < = >' },
  { id: 's4', text: 'I can write a real-world example using integers' },
  { id: 's5', text: 'I know that every integer is also a rational number' },
];

export default function ReflectPhase({ onComplete }) {
  const [activeTab, setActiveTab] = useState('concepts');
  const [reflections, setReflections] = useState({});
  const [checks, setChecks] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    playVoice('reflect_intro.mp3');
  }, []);

  const handleReflect = (id, val) => setReflections(r => ({ ...r, [id]: val }));
  const toggleCheck = (id) => setChecks(c => ({ ...c, [id]: !c[id] }));

  const checkedCount = Object.values(checks).filter(Boolean).length;
  const canSubmit = checkedCount >= 3;

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="reflect-phase">
        <div className="reflect-done-card">
          <div style={{ fontSize: '5rem', marginBottom: '20px', animation: 'bounce 1.5s infinite' }}>🎓</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '12px' }}>
            Amazing Work!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '28px' }}>
            You have completed the full <strong style={{ color: 'var(--gold)' }}>Integers &amp; Rational Numbers</strong> journey!
            You went through 5 powerful phases — Wonder, Story, Simulate, Practice, and now Reflect.
            You are well on your way to mastering Grade 7 Mathematics!
          </p>

          {/* Stars */}
          <div style={{ fontSize: '2.5rem', marginBottom: '24px', letterSpacing: '4px' }}>
            ⭐⭐⭐⭐⭐
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px',
            marginBottom: '28px', textAlign: 'center',
          }}>
            {[
              { icon: '🔍', label: 'Wondered' },
              { icon: '📖', label: 'Explored Story' },
              { icon: '🧪', label: 'Simulated' },
              { icon: '🎮', label: 'Practiced' },
              { icon: '📓', label: 'Reflected' },
              { icon: '🏆', label: 'Complete!' },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                padding: '12px 8px', borderRadius: '14px',
                background: 'rgba(76,175,80,0.12)',
                border: '1px solid rgba(76,175,80,0.3)',
              }}>
                <div style={{ fontSize: '1.8rem' }}>{icon}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--green-light)', marginTop: '4px' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={onComplete}
            id="reflect-finish-btn"
          >
            🏠 Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-phase">
      <div className="reflect-header">
        <h2 className="reflect-title">
          📓 <span style={{ color: 'var(--gold)' }}>Reflect</span> &amp; Review
        </h2>
        <p className="reflect-subtitle">
          Let's consolidate everything you've learned about Integers &amp; Rational Numbers!
        </p>
      </div>

      {/* Tab bar */}
      <div className="reflect-tabs">
        {[
          { key: 'concepts', icon: '📚', label: 'Key Concepts' },
          { key: 'journal', icon: '✏️', label: 'My Journal' },
          { key: 'selfcheck', icon: '✅', label: 'Self-Check' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`reflect-tab${activeTab === tab.key ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            id={`reflect-tab-${tab.key}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Key Concepts */}
      {activeTab === 'concepts' && (
        <div className="reflect-concepts">
          {KEY_CONCEPTS.map((concept, i) => (
            <div
              key={concept.title}
              className="concept-card"
              style={{
                '--concept-color': concept.color,
                animation: `fadeSlideUp 0.4s ${i * 0.08}s ease both`,
              }}
            >
              <div className="concept-header">
                <span className="concept-icon">{concept.icon}</span>
                <h3 className="concept-title" style={{ color: concept.color }}>
                  {concept.title}
                </h3>
              </div>
              <ul className="concept-points">
                {concept.points.map((pt, j) => (
                  <li key={j} className="concept-point">
                    <span style={{ color: concept.color, marginRight: '8px' }}>→</span>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: '8px' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('journal')} id="goto-journal-btn">
              ✏️ Go to My Journal →
            </button>
          </div>
        </div>
      )}

      {/* Tab: Journal */}
      {activeTab === 'journal' && (
        <div className="reflect-journal">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Take a moment to write your thoughts. There are no right or wrong answers here — this is your personal learning journal!
          </p>
          {REFLECT_QUESTIONS.map(q => (
            <div key={q.id} className="journal-question">
              <label className="journal-label" htmlFor={`journal-${q.id}`}>
                <span style={{ fontSize: '1.5rem' }}>{q.emoji}</span>
                {q.label}
              </label>
              <textarea
                id={`journal-${q.id}`}
                className="journal-textarea"
                placeholder="Write your thoughts here…"
                value={reflections[q.id] || ''}
                onChange={e => handleReflect(q.id, e.target.value)}
                rows={3}
              />
            </div>
          ))}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button className="btn btn-outline btn-sm" onClick={() => setActiveTab('selfcheck')} id="goto-selfcheck-btn">
              ✅ Go to Self-Check →
            </button>
          </div>
        </div>
      )}

      {/* Tab: Self-Check */}
      {activeTab === 'selfcheck' && (
        <div className="reflect-selfcheck">
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
            Tick the boxes for things you feel confident about. Check at least 3 to finish!
          </p>
          <div className="selfcheck-list">
            {SELF_CHECKS.map(item => (
              <label
                key={item.id}
                className={`selfcheck-item${checks[item.id] ? ' checked' : ''}`}
                htmlFor={`sc-${item.id}`}
              >
                <input
                  type="checkbox"
                  id={`sc-${item.id}`}
                  checked={!!checks[item.id]}
                  onChange={() => toggleCheck(item.id)}
                  className="selfcheck-input"
                />
                <span className="selfcheck-box">{checks[item.id] ? '✓' : ''}</span>
                <span className="selfcheck-text">{item.text}</span>
              </label>
            ))}
          </div>

          <div className="selfcheck-progress">
            <div className="progress-bar-label">
              <span>Confidence level</span>
              <span>{checkedCount} / {SELF_CHECKS.length} ticked</span>
            </div>
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${(checkedCount / SELF_CHECKS.length) * 100}%` }}
              />
            </div>
          </div>

          {canSubmit ? (
            <div style={{ textAlign: 'center', marginTop: '24px', animation: 'popIn 0.4s ease both' }}>
              <p style={{ color: 'var(--green-light)', fontWeight: 700, marginBottom: '16px' }}>
                🌟 Great job! You are confident in your learning!
              </p>
              <button
                className="btn btn-green btn-lg"
                onClick={handleSubmit}
                id="reflect-submit-btn"
              >
                Complete the Journey! 🎓
              </button>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '20px', fontSize: '0.9rem' }}>
              Tick at least 3 boxes to complete your reflection 💪
            </p>
          )}
        </div>
      )}
    </div>
  );
}

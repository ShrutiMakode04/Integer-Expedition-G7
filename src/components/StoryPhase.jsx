import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { playVoice } from '../utils/audio';

const STORY_SLIDES = [
  {
    image: '/images/story_temperature.png',
    title: 'The Temperature Mystery',
    text: 'Sarah stepped outside and gasped — the thermometer read -3°C! She ran back to tell John, who was cozy inside at +22°C. "That\'s 25 degrees warmer!" said John, scribbling on paper. The numbers below zero are called negative integers. Numbers above zero are positive integers. Zero is the boundary between them — neither positive nor negative!',
    highlight: '"Integers include: … −3, −2, −1, 0, +1, +2, +3 … — whole numbers extending in both directions!"',
    mascot: '🌡️',
    mascotText: 'Negative integers go left on the number line. Positive go right! 🔢',
  },
  {
    image: '/images/story_numberline.png',
    title: "Mike's Number Line Adventure",
    text: 'Mike grabbed a marker and drew a long arrow on the whiteboard. He placed 0 in the centre, then marked +1, +2, +3… to the right in warm orange, and −1, −2, −3… to the left in cool blue. "The further left you go, the smaller the number," he told his class. Even −100 has a home on this infinite line!',
    highlight: '"On the number line: the further LEFT → the SMALLER. The further RIGHT → the LARGER!"',
    mascot: '📏',
    mascotText: 'Numbers increase from left to right — always! ➡️',
  },
  {
    image: '/images/story_pizza.png',
    title: 'Splitting the Pizza — Rational Numbers!',
    text: 'John ordered a pizza and cut it into 8 equal slices. Sarah took 3 slices — that\'s 3/8 of the pizza. Mike took 2 slices — that\'s 2/8, which simplifies to 1/4. These fractions (3/8, 1/4, −1/2) are called RATIONAL NUMBERS — any number that can be written as p/q where p and q are integers and q ≠ 0!',
    highlight: '"Rational Number = p/q, where p and q are integers and q ≠ 0. Includes all integers, fractions, and decimals!"',
    mascot: '🍕',
    mascotText: 'Every integer is also rational: 5 = 5/1. So integers ⊂ rationals! 🧠',
  },
  {
    image: '/images/story_ordering.png',
    title: 'Ordering Integers & Rational Numbers',
    text: 'Mike challenged Sarah and John: "Put these in order from least to greatest: −5, −½, 0, ¾, 3." Sarah converted everything to decimals: −5.0, −0.5, 0, 0.75, 3.0. Then she placed them left to right on the number line. The trick: negative fractions are still negative — they fall between negative integers and zero!',
    highlight: '"To compare rational numbers — convert to decimals, then use the number line: left is less, right is more!"',
    mascot: '⚖️',
    mascotText: '−½ is GREATER than −5 because −0.5 > −5.0 on the number line! 📊',
  },
  {
    image: '/images/story_realworld.png',
    title: 'Integers & Rationals in the Real World',
    text: 'John, Mike, and Sarah found integers everywhere! Banks show +$50 for deposits and −$30 for withdrawals. Mountain peaks rise to +8,849m; valleys sink to −430m below sea level. A football team gains +7 yards or loses −3 yards. Even exam scores, temperatures, and profit/loss use these numbers every single day!',
    highlight: '"Integers model gain & loss, above & below, profit & debt. Rational numbers model parts, percentages, and measurements!"',
    mascot: '🌍',
    mascotText: 'You now see integers and rationals in the real world — you\'re a Math Explorer! 🏆',
  },
];

export default function StoryPhase({ onComplete }) {
  const [slideIdx, setSlideIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const slide = STORY_SLIDES[slideIdx];
  const isLast = slideIdx === STORY_SLIDES.length - 1;

  const goNext = useCallback(() => {
    if (isLast) { onComplete(); }
    else { setSlideIdx(i => i + 1); setAnimKey(k => k + 1); }
  }, [isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (slideIdx > 0) { setSlideIdx(i => i - 1); setAnimKey(k => k + 1); }
  }, [slideIdx]);

  useEffect(() => {
    playVoice(`story_${slideIdx + 1}.mp3`);
  }, [slideIdx]);

  return (
    <div className="story-phase">
      {/* Side-by-side slide */}
      <div className="story-slide" key={animKey}>

        {/* LEFT: smaller image — fixed height, no overflow */}
        <div className="story-image-container">
          <img
            src={slide.image}
            alt={slide.title}
            onError={e => {
              e.target.style.display = 'none';
              e.target.parentElement.style.background = 'rgba(255,255,255,0.05)';
              e.target.parentElement.style.display = 'flex';
              e.target.parentElement.style.alignItems = 'center';
              e.target.parentElement.style.justifyContent = 'center';
              e.target.parentElement.innerHTML = `<span style="font-size:5rem">${slide.mascot}</span>`;
            }}
          />
        </div>

        {/* RIGHT: text content */}
        <div className="story-content">
          <div className="story-slide-number">
            Slide {slideIdx + 1} of {STORY_SLIDES.length}
          </div>

          <h2 className="story-title">{slide.title}</h2>

          <p className="story-text">{slide.text}</p>

          <blockquote className="story-highlight">{slide.highlight}</blockquote>

          <div className="story-mascot">
            <span className="story-mascot-icon">{slide.mascot}</span>
            <span>{slide.mascotText}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="story-nav">
        <button
          className="btn btn-outline btn-sm"
          onClick={goPrev}
          disabled={slideIdx === 0}
          id="story-prev-btn"
          style={{ opacity: slideIdx === 0 ? 0.4 : 1 }}
        >
          <ChevronLeft size={16} /> Back
        </button>

        {/* Progress dots */}
        <div className="story-progress">
          <div className="progress-dots">
            {STORY_SLIDES.map((_, i) => (
              <button
                key={i}
                className={`progress-dot${i === slideIdx ? ' active' : ''}${i < slideIdx ? ' completed' : ''}`}
                onClick={() => { setSlideIdx(i); setAnimKey(k => k + 1); }}
                aria-label={`Go to slide ${i + 1}`}
                id={`story-dot-${i}`}
              />
            ))}
          </div>
          <div className="progress-bar-container">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${((slideIdx + 1) / STORY_SLIDES.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <button
          className={`btn btn-sm${isLast ? ' btn-green' : ' btn-primary'}`}
          onClick={goNext}
          id="story-next-btn"
        >
          {isLast ? 'Go Explore! 🧪' : <>Next <ChevronRight size={16} /></>}
        </button>
      </div>
    </div>
  );
}

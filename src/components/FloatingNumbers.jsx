import { useMemo } from 'react';

const SYMBOLS = [
  '-7', '+3', '¾', '-½', '0', '²⁄₃', '-5', '+8', '⅓', '-2',
  '+6', '⁴⁄₅', '-10', '+½', '|x|', '-¼', '⅔', '+9', '-4', '⅛',
];

export default function FloatingNumbers() {
  const items = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      symbol: SYMBOLS[i % SYMBOLS.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 18 + Math.random() * 14,
      size: 2.2 + Math.random() * 2,
    }));
  }, []);

  return (
    <div className="floating-numbers" aria-hidden="true">
      {items.map(item => (
        <span
          key={item.id}
          className="floating-number"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            fontSize: `${item.size}rem`,
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}

/**
 * Question Bank — Integers & Rational Numbers, Grade 7
 * 8 cards (worlds 0-7), 10 questions each = 80 total unique questions
 * 
 * Question types:
 *  'mcq'     — Multiple choice (4 options)
 *  'tf'      — True/False
 *  'fill'    — Fill in the blank (4 options)
 *  'word'    — Word problem (4 options)
 *  'order'   — Order from least to greatest (4 options)
 *  'compare' — Which symbol: <, =, > (3 options)
 *  'id'      — Identify integer or rational (4 options)
 *  'compute' — Compute result (4 options)
 */

const ALL_QUESTIONS = [
  // =====================================================================
  // CARD 0 — Integer Basics 🔢
  // =====================================================================
  {
    id: 0, world: 0, type: 'mcq',
    question: 'Which of the following is an integer?',
    options: ['3/4', '-7', '0.5', '√2'],
    correct: 1,
    explanation: '-7 is an integer because it is a whole number (negative whole numbers are integers).',
  },
  {
    id: 1, world: 0, type: 'tf',
    question: 'True or False: Zero (0) is an integer.',
    options: ['True', 'False'],
    correct: 0,
    explanation: 'True! Zero is an integer. Integers include: ..., -3, -2, -1, 0, 1, 2, 3, ...',
  },
  {
    id: 2, world: 0, type: 'mcq',
    question: 'What is the opposite of -9?',
    options: ['-9', '0', '+9', '1/9'],
    correct: 2,
    explanation: 'The opposite of -9 is +9. Opposites are the same distance from zero but on different sides of the number line.',
  },
  {
    id: 3, world: 0, type: 'id',
    question: 'Which set contains ONLY integers?',
    options: ['{-3, 0, 5}', '{-3, 0.5, 5}', '{0, ½, 7}', '{1.1, 2.2, 3.3}'],
    correct: 0,
    explanation: '{-3, 0, 5} contains only integers. All are whole numbers (negative, zero, and positive).',
  },
  {
    id: 4, world: 0, type: 'mcq',
    question: 'What is the absolute value of -13?',
    options: ['-13', '0', '13', '1/13'],
    correct: 2,
    explanation: '|−13| = 13. Absolute value is the distance from zero — always non-negative.',
  },
  {
    id: 5, world: 0, type: 'tf',
    question: 'True or False: -5 is greater than -2.',
    options: ['True', 'False'],
    correct: 1,
    explanation: 'False! -5 < -2. On a number line, -5 is to the LEFT of -2, so it is smaller.',
  },
  {
    id: 6, world: 0, type: 'mcq',
    question: 'Which integer is between -4 and -2 on the number line?',
    options: ['-5', '-3', '0', '-1'],
    correct: 1,
    explanation: '-3 is between -4 and -2 on the number line. -4 < -3 < -2.',
  },
  {
    id: 7, world: 0, type: 'fill',
    question: 'The absolute value of -20 equals ___.',
    options: ['-20', '0', '20', '200'],
    correct: 2,
    explanation: '|−20| = 20. Absolute value gives the distance from zero, always positive.',
  },
  {
    id: 8, world: 0, type: 'mcq',
    question: 'Sarah wrote: "All negative numbers are integers." Is she correct?',
    options: ['Yes, always', 'No — fractions like -½ are negative but not integers', 'Yes, if they are less than -1', 'Yes, all negatives are whole'],
    correct: 1,
    explanation: 'Not all negatives are integers! -½ is negative but is not an integer (it\'s a fraction). Integers are whole numbers only.',
  },
  {
    id: 9, world: 0, type: 'id',
    question: 'How many integers are between -3 and +3 (not including -3 and +3)?',
    options: ['4', '5', '6', '7'],
    correct: 1,
    explanation: 'The integers are -2, -1, 0, 1, 2 → that\'s 5 integers between -3 and +3.',
  },

  // =====================================================================
  // CARD 1 — Positive & Negative ➕➖
  // =====================================================================
  {
    id: 10, world: 1, type: 'word',
    question: 'John went 8 floors UP in an elevator, then 5 floors DOWN. What integer shows his net movement?',
    options: ['+13', '+3', '-3', '-13'],
    correct: 1,
    explanation: '+8 (up) and -5 (down): 8 - 5 = +3. Net movement is 3 floors up.',
  },
  {
    id: 11, world: 1, type: 'compute',
    question: 'What is (-4) + (-6)?',
    options: ['2', '-10', '+10', '-2'],
    correct: 1,
    explanation: 'Adding two negatives: (-4) + (-6) = -10. The negatives combine.',
  },
  {
    id: 12, world: 1, type: 'mcq',
    question: 'Which number is farthest from zero?',
    options: ['-3', '+5', '-8', '+6'],
    correct: 2,
    explanation: '|-8| = 8 is the greatest absolute value, so -8 is farthest from zero on the number line.',
  },
  {
    id: 13, world: 1, type: 'word',
    question: 'The temperature was -5°C in the morning. By noon it rose by 9°C. What is the noon temperature?',
    options: ['-14°C', '-4°C', '+4°C', '+14°C'],
    correct: 2,
    explanation: '-5 + 9 = +4°C. The temperature rose from -5 to +4.',
  },
  {
    id: 14, world: 1, type: 'compute',
    question: 'What is 3 + (-11)?',
    options: ['+8', '-8', '+14', '-14'],
    correct: 1,
    explanation: '3 + (-11) = 3 - 11 = -8. The negative is larger, so the result is negative.',
  },
  {
    id: 15, world: 1, type: 'tf',
    question: 'True or False: The sum of a positive and a negative integer is always negative.',
    options: ['True', 'False'],
    correct: 1,
    explanation: 'False! Example: 10 + (-3) = +7, which is positive. It depends on which has greater absolute value.',
  },
  {
    id: 16, world: 1, type: 'mcq',
    question: 'Mike has $15. He spends $22. Which integer represents his account balance?',
    options: ['+7', '-7', '+37', '-37'],
    correct: 1,
    explanation: '15 - 22 = -7. Mike is $7 in debt, represented as -7.',
  },
  {
    id: 17, world: 1, type: 'compute',
    question: 'What is (-7) - (-3)?',
    options: ['-10', '+10', '-4', '+4'],
    correct: 2,
    explanation: 'Subtracting a negative = adding: (-7) - (-3) = -7 + 3 = -4.',
  },
  {
    id: 18, world: 1, type: 'word',
    question: 'A submarine is at -40m below sea level. It descends 15m more. What is its new depth?',
    options: ['-25m', '+55m', '-55m', '+25m'],
    correct: 2,
    explanation: '-40 + (-15) = -55m. Going deeper means the negative number gets larger in magnitude.',
  },
  {
    id: 19, world: 1, type: 'compute',
    question: 'What is (-3) × (-4)?',
    options: ['-12', '+12', '-7', '+7'],
    correct: 1,
    explanation: 'Negative × Negative = Positive! (-3) × (-4) = +12.',
  },

  // =====================================================================
  // CARD 2 — Number Line Pro 📏
  // =====================================================================
  {
    id: 20, world: 2, type: 'order',
    question: 'Order from LEAST to GREATEST: -5, 3, -1, 0, 2',
    options: ['-5, -1, 0, 2, 3', '3, 2, 0, -1, -5', '-1, -5, 0, 2, 3', '0, -1, -5, 2, 3'],
    correct: 0,
    explanation: 'On a number line, left to right: -5 < -1 < 0 < 2 < 3.',
  },
  {
    id: 21, world: 2, type: 'mcq',
    question: 'On a number line, what integer is 4 units to the LEFT of -2?',
    options: ['2', '-6', '6', '-4'],
    correct: 1,
    explanation: 'Moving left means subtracting: -2 - 4 = -6.',
  },
  {
    id: 22, world: 2, type: 'word',
    question: 'Sarah is at position 3 on a number line. She moves 8 units left. Where is she now?',
    options: ['+11', '-5', '+5', '-11'],
    correct: 1,
    explanation: '3 - 8 = -5. Moving left subtracts from your position.',
  },
  {
    id: 23, world: 2, type: 'mcq',
    question: 'Which point is between -7 and -3 on the number line?',
    options: ['-8', '-2', '-5', '0'],
    correct: 2,
    explanation: '-5 is between -7 and -3: -7 < -5 < -3.',
  },
  {
    id: 24, world: 2, type: 'compare',
    question: 'Compare: -10 ___ -4',
    options: ['<', '=', '>'],
    correct: 0,
    explanation: '-10 < -4. On the number line, -10 is farther left (smaller) than -4.',
  },
  {
    id: 25, world: 2, type: 'fill',
    question: 'The distance between -3 and +5 on a number line is ___.',
    options: ['2', '6', '8', '15'],
    correct: 2,
    explanation: 'Distance = |5 - (-3)| = |5 + 3| = 8.',
  },
  {
    id: 26, world: 2, type: 'order',
    question: 'Order from GREATEST to LEAST: -8, -1, 4, -3',
    options: ['4, -1, -3, -8', '-8, -3, -1, 4', '4, -8, -1, -3', '-1, 4, -3, -8'],
    correct: 0,
    explanation: 'Greatest to least: 4 > -1 > -3 > -8.',
  },
  {
    id: 27, world: 2, type: 'word',
    question: 'Mike is at -3 on a number line and John is at +7. How far apart are they?',
    options: ['4', '10', '-10', '-4'],
    correct: 1,
    explanation: '|7 - (-3)| = |7 + 3| = 10 units apart.',
  },
  {
    id: 28, world: 2, type: 'mcq',
    question: 'Which integer is the greatest: -100, -1, 0, -50?',
    options: ['-100', '-50', '-1', '0'],
    correct: 3,
    explanation: '0 is the greatest because it is farthest to the right on the number line.',
  },
  {
    id: 29, world: 2, type: 'tf',
    question: 'True or False: On the number line, numbers increase from left to right.',
    options: ['True', 'False'],
    correct: 0,
    explanation: 'True! Numbers always increase from left to right on a standard number line.',
  },

  // =====================================================================
  // CARD 3 — Rational Explorer ½
  // =====================================================================
  {
    id: 30, world: 3, type: 'id',
    question: 'Which of the following is a rational number?',
    options: ['√7', 'π', '-3/5', '√2'],
    correct: 2,
    explanation: '-3/5 is rational because it can be expressed as a fraction p/q where p and q are integers and q ≠ 0.',
  },
  {
    id: 31, world: 3, type: 'tf',
    question: 'True or False: Every integer is also a rational number.',
    options: ['True', 'False'],
    correct: 0,
    explanation: 'True! Every integer n can be written as n/1, which is a fraction of two integers. So all integers are rational.',
  },
  {
    id: 32, world: 3, type: 'mcq',
    question: 'Which fraction is equivalent to 0.75?',
    options: ['1/4', '3/5', '3/4', '7/5'],
    correct: 2,
    explanation: '0.75 = 75/100 = 3/4.',
  },
  {
    id: 33, world: 3, type: 'fill',
    question: '2/5 as a decimal is ___.',
    options: ['0.4', '0.25', '0.5', '0.2'],
    correct: 0,
    explanation: '2 ÷ 5 = 0.4.',
  },
  {
    id: 34, world: 3, type: 'id',
    question: 'Which is NOT a rational number?',
    options: ['-7', '0', '5/8', '√5'],
    correct: 3,
    explanation: '√5 is irrational — its decimal goes on forever without repeating.',
  },
  {
    id: 35, world: 3, type: 'mcq',
    question: 'What type of decimal is 1/3?',
    options: ['Terminating', 'Repeating', 'Non-terminating non-repeating', 'None'],
    correct: 1,
    explanation: '1/3 = 0.333... (a repeating decimal). All rational numbers give terminating or repeating decimals.',
  },
  {
    id: 36, world: 3, type: 'fill',
    question: 'Which fraction is in its simplest form?',
    options: ['4/8', '6/9', '5/7', '3/6'],
    correct: 2,
    explanation: '5/7 is already in simplest form — 5 and 7 share no common factors other than 1.',
  },
  {
    id: 37, world: 3, type: 'word',
    question: 'Sarah ate 3/8 of a pizza. John ate 2/8. How much pizza did they eat together?',
    options: ['1/8', '5/8', '5/16', '6/8'],
    correct: 1,
    explanation: '3/8 + 2/8 = 5/8. Same denominator: just add numerators.',
  },
  {
    id: 38, world: 3, type: 'compute',
    question: 'What is -1/2 + 3/4?',
    options: ['-1/4', '1/4', '-5/4', '5/4'],
    correct: 1,
    explanation: '-1/2 = -2/4. Then -2/4 + 3/4 = 1/4.',
  },
  {
    id: 39, world: 3, type: 'tf',
    question: 'True or False: 0.125 is a rational number.',
    options: ['True', 'False'],
    correct: 0,
    explanation: 'True! 0.125 = 125/1000 = 1/8. It terminates, so it is rational.',
  },

  // =====================================================================
  // CARD 4 — Compare & Order ⚖️
  // =====================================================================
  {
    id: 40, world: 4, type: 'compare',
    question: 'Compare: -1/2 ___ -3/4',
    options: ['<', '=', '>'],
    correct: 2,
    explanation: '-1/2 = -0.5 and -3/4 = -0.75. Since -0.5 > -0.75, we have -1/2 > -3/4.',
  },
  {
    id: 41, world: 4, type: 'order',
    question: 'Order from LEAST to GREATEST: -2, 1/2, -1/4, 0',
    options: ['-2, -1/4, 0, 1/2', '1/2, 0, -1/4, -2', '-1/4, -2, 0, 1/2', '0, -1/4, -2, 1/2'],
    correct: 0,
    explanation: '-2 < -1/4 < 0 < 1/2. Negative integers < negative fractions < zero < positive.',
  },
  {
    id: 42, world: 4, type: 'compare',
    question: 'Compare: 0.6 ___ 3/5',
    options: ['<', '=', '>'],
    correct: 1,
    explanation: '3/5 = 0.6. So 0.6 = 3/5.',
  },
  {
    id: 43, world: 4, type: 'mcq',
    question: 'Which is the smallest number? -0.5, -3, 0, -1/2',
    options: ['-0.5', '-3', '0', '-1/2'],
    correct: 1,
    explanation: '-3 is the smallest because it is farthest to the left on the number line. -3 < -1/2 = -0.5 < 0.',
  },
  {
    id: 44, world: 4, type: 'order',
    question: 'Order from GREATEST to LEAST: 3/4, -0.5, 1/4, -1',
    options: ['3/4, 1/4, -0.5, -1', '-1, -0.5, 1/4, 3/4', '1/4, 3/4, -0.5, -1', '3/4, -0.5, 1/4, -1'],
    correct: 0,
    explanation: '3/4 = 0.75 > 1/4 = 0.25 > -0.5 > -1. Greatest to least.',
  },
  {
    id: 45, world: 4, type: 'compare',
    question: 'Compare: -2/3 ___ -3/4',
    options: ['<', '=', '>'],
    correct: 2,
    explanation: '-2/3 ≈ -0.667 and -3/4 = -0.75. -0.667 > -0.75, so -2/3 > -3/4.',
  },
  {
    id: 46, world: 4, type: 'mcq',
    question: 'Which list is in correct order from least to greatest?',
    options: ['-5, -2, 0, 3/4, 2', '2, 3/4, 0, -2, -5', '-5, 0, -2, 3/4, 2', '-2, -5, 0, 3/4, 2'],
    correct: 0,
    explanation: '-5 < -2 < 0 < 3/4 < 2 is correct ascending order.',
  },
  {
    id: 47, world: 4, type: 'word',
    question: 'Mike scored -3 points, Sarah scored +2.5 points, John scored -0.5 points. Who scored the MOST?',
    options: ['Mike', 'Sarah', 'John', 'They tied'],
    correct: 1,
    explanation: '+2.5 > -0.5 > -3. Sarah scored the most with +2.5 points.',
  },
  {
    id: 48, world: 4, type: 'fill',
    question: 'Between -3/4 and -1/4, which fraction is greater?',
    options: ['-3/4', 'Neither', '-1/4', 'Both equal'],
    correct: 2,
    explanation: '-1/4 = -0.25 and -3/4 = -0.75. Since -0.25 > -0.75, -1/4 is greater.',
  },
  {
    id: 49, world: 4, type: 'tf',
    question: 'True or False: -0.25 > -1/4.',
    options: ['True', 'False'],
    correct: 1,
    explanation: 'False! -0.25 = -1/4. They are equal.',
  },

  // =====================================================================
  // CARD 5 — Integer Operations ➗
  // =====================================================================
  {
    id: 50, world: 5, type: 'compute',
    question: 'What is (-8) ÷ (+2)?',
    options: ['+4', '-4', '+16', '-16'],
    correct: 1,
    explanation: 'Negative ÷ Positive = Negative. (-8) ÷ 2 = -4.',
  },
  {
    id: 51, world: 5, type: 'compute',
    question: 'What is (+5) × (-6)?',
    options: ['+30', '-30', '+11', '-11'],
    correct: 1,
    explanation: 'Positive × Negative = Negative. 5 × 6 = 30, so (+5) × (-6) = -30.',
  },
  {
    id: 52, world: 5, type: 'compute',
    question: 'What is (-12) ÷ (-4)?',
    options: ['-3', '+3', '-48', '+48'],
    correct: 1,
    explanation: 'Negative ÷ Negative = Positive. 12 ÷ 4 = 3, so (-12) ÷ (-4) = +3.',
  },
  {
    id: 53, world: 5, type: 'word',
    question: 'Sarah owes $6 to each of 4 friends. What integer shows the total she owes?',
    options: ['+24', '-24', '+10', '-10'],
    correct: 1,
    explanation: '4 × (-6) = -24. The negative shows debt.',
  },
  {
    id: 54, world: 5, type: 'compute',
    question: 'What is (-9) + (+9)?',
    options: ['+18', '-18', '0', '-81'],
    correct: 2,
    explanation: 'A number and its opposite always sum to zero: (-9) + 9 = 0.',
  },
  {
    id: 55, world: 5, type: 'compute',
    question: 'What is 15 - (-5)?',
    options: ['10', '20', '-20', '-10'],
    correct: 1,
    explanation: 'Subtracting a negative = adding: 15 - (-5) = 15 + 5 = 20.',
  },
  {
    id: 56, world: 5, type: 'compute',
    question: 'What is (-2) × (-2) × (-2)?',
    options: ['+8', '-8', '+6', '-6'],
    correct: 1,
    explanation: '(-2) × (-2) = +4; then +4 × (-2) = -8. Odd number of negatives → negative result.',
  },
  {
    id: 57, world: 5, type: 'word',
    question: 'A fish swims 3 meters down every minute. After 5 minutes, what integer shows its depth?',
    options: ['+15', '-15', '+2', '-2'],
    correct: 1,
    explanation: '5 × (-3) = -15. Going down is negative; -15 meters below the surface.',
  },
  {
    id: 58, world: 5, type: 'tf',
    question: 'True or False: The product of two negative integers is always negative.',
    options: ['True', 'False'],
    correct: 1,
    explanation: 'False! Negative × Negative = Positive. Example: (-4) × (-3) = +12.',
  },
  {
    id: 59, world: 5, type: 'compute',
    question: 'What is (-3) + 5 - (-2)?',
    options: ['4', '0', '6', '-6'],
    correct: 0,
    explanation: '-3 + 5 = 2; then 2 - (-2) = 2 + 2 = 4.',
  },

  // =====================================================================
  // CARD 6 — Word Problem Solver 📝
  // =====================================================================
  {
    id: 60, world: 6, type: 'word',
    question: 'The temperature drops from 7°C to -3°C. By how many degrees did it drop?',
    options: ['4°C', '10°C', '-10°C', '-4°C'],
    correct: 1,
    explanation: '7 - (-3) = 7 + 3 = 10°C drop.',
  },
  {
    id: 61, world: 6, type: 'word',
    question: 'John has -$12 in his bank account (overdrawn). He deposits $20. What is his new balance?',
    options: ['-$8', '+$8', '+$32', '-$32'],
    correct: 1,
    explanation: '-12 + 20 = +$8. John now has a positive balance.',
  },
  {
    id: 62, world: 6, type: 'word',
    question: 'A mountain peak is 2000m above sea level (+2000m). A valley is 150m below sea level. What is the difference in elevation?',
    options: ['1850m', '2150m', '150m', '2000m'],
    correct: 1,
    explanation: '2000 - (-150) = 2000 + 150 = 2150m difference.',
  },
  {
    id: 63, world: 6, type: 'word',
    question: 'Mike scored +7, -3, +5, -2 in four rounds of a game. What is his total score?',
    options: ['7', '-7', '17', '-17'],
    correct: 0,
    explanation: '7 + (-3) + 5 + (-2) = 7 - 3 + 5 - 2 = 7.',
  },
  {
    id: 64, world: 6, type: 'word',
    question: 'Sarah cuts a ribbon of 3 meters into pieces of 3/4 m each. How many complete pieces does she get?',
    options: ['3', '4', '5', '6'],
    correct: 1,
    explanation: '3 ÷ (3/4) = 3 × (4/3) = 4 complete pieces.',
  },
  {
    id: 65, world: 6, type: 'word',
    question: 'A diver is at -15m. She rises 8m. What is her new depth?',
    options: ['-23m', '-7m', '+7m', '+23m'],
    correct: 1,
    explanation: '-15 + 8 = -7m. She is now 7m below the surface.',
  },
  {
    id: 66, world: 6, type: 'word',
    question: 'John earns $12/hour. He works -3 hours of overtime (meaning 3 hours less than scheduled). How much less did he earn?',
    options: ['+$36', '-$36', '+$4', '-$4'],
    correct: 1,
    explanation: '12 × (-3) = -$36. He earned $36 less than expected.',
  },
  {
    id: 67, world: 6, type: 'word',
    question: 'A football team gained 5 yards, lost 8 yards, then gained 3 yards. Net yards gained?',
    options: ['-5', '0', '+5', '+16'],
    correct: 1,
    explanation: '5 + (-8) + 3 = 5 - 8 + 3 = 0. Net gain is 0 yards.',
  },
  {
    id: 68, world: 6, type: 'word',
    question: 'Mike had 2/3 of a tank of petrol. He used 1/4 of a tank. How much petrol is left?',
    options: ['1/3', '5/12', '3/7', '1/12'],
    correct: 1,
    explanation: '2/3 - 1/4 = 8/12 - 3/12 = 5/12.',
  },
  {
    id: 69, world: 6, type: 'word',
    question: 'Sarah lives on the 8th floor (8 above ground = +8). The parking garage is 3 floors below ground (-3). How many floors apart are they?',
    options: ['5', '11', '24', '-5'],
    correct: 1,
    explanation: '8 - (-3) = 8 + 3 = 11 floors apart.',
  },

  // =====================================================================
  // CARD 7 — Master Challenge 🏆
  // =====================================================================
  {
    id: 70, world: 7, type: 'compute',
    question: 'Simplify: (-2/3) × (9/4)',
    options: ['3/2', '-3/2', '6/7', '-6/7'],
    correct: 1,
    explanation: '(-2/3) × (9/4) = -18/12 = -3/2.',
  },
  {
    id: 71, world: 7, type: 'order',
    question: 'Order from LEAST to GREATEST: -1.5, -3/2, 0.5, 1/2, -0.25',
    options: ['-3/2, -1.5, -0.25, 1/2, 0.5', '-1.5, -3/2, -0.25, 0.5, 1/2', '-0.25, -3/2, -1.5, 1/2, 0.5', 'They are already in order'],
    correct: 3,
    explanation: '-1.5 = -3/2 (equal), so they share the same position. -3/2 = -1.5, then -0.25, then 0.5 = 1/2. Order: -1.5 = -3/2 < -0.25 < 0.5 = 1/2.',
  },
  {
    id: 72, world: 7, type: 'compute',
    question: 'What is (-5/6) ÷ (5/12)?',
    options: ['1/2', '-1/2', '-2', '2'],
    correct: 2,
    explanation: '(-5/6) ÷ (5/12) = (-5/6) × (12/5) = -60/30 = -2.',
  },
  {
    id: 73, world: 7, type: 'word',
    question: 'John\'s score changed by -1/2 per round for 6 rounds. What is his total change?',
    options: ['-3', '+3', '-12', '+12'],
    correct: 0,
    explanation: '6 × (-1/2) = -3. Total change is -3.',
  },
  {
    id: 74, world: 7, type: 'mcq',
    question: 'Which property states that a + (-a) = 0?',
    options: ['Commutative Property', 'Additive Inverse Property', 'Associative Property', 'Distributive Property'],
    correct: 1,
    explanation: 'The Additive Inverse Property states that every number a has an opposite -a such that a + (-a) = 0.',
  },
  {
    id: 75, world: 7, type: 'compute',
    question: 'Evaluate: |(-4) + (-3)| + |5 - 9|',
    options: ['3', '7', '11', '-11'],
    correct: 2,
    explanation: '|(-4) + (-3)| = |-7| = 7; |5 - 9| = |-4| = 4; 7 + 4 = 11.',
  },
  {
    id: 76, world: 7, type: 'fill',
    question: 'The set of integers is a ___set of rational numbers.',
    options: ['disjoint', 'identical', 'subset', 'superset'],
    correct: 2,
    explanation: 'Integers are a SUBSET of rational numbers. Every integer is rational, but not every rational is an integer.',
  },
  {
    id: 77, world: 7, type: 'word',
    question: 'Mike starts at -5 on a number line, moves +3, then -7, then +2. Where does he end?',
    options: ['-7', '+7', '-17', '+17'],
    correct: 0,
    explanation: '-5 + 3 = -2; -2 - 7 = -9; -9 + 2 = -7.',
  },
  {
    id: 78, world: 7, type: 'compute',
    question: 'What is 2/3 + (-1/3) × 3?',
    options: ['1', '-1/3', '2/3', '-1'],
    correct: 1,
    explanation: 'Multiplication first: (-1/3) × 3 = -1. Then: 2/3 + (-1) = 2/3 - 3/3 = -1/3.',
  },
  {
    id: 79, world: 7, type: 'mcq',
    question: 'Sarah says: "The rational numbers are dense — between any two rational numbers there is another rational number." Is she correct?',
    options: ['Yes, always', 'No, never', 'Only for positive rationals', 'Only for integers'],
    correct: 0,
    explanation: 'Yes! Rational numbers are dense. Between any two rationals a and b, (a+b)/2 is also rational.',
  },
];

/**
 * Generate shuffled questions for a session.
 * Each card's 10 questions are shuffled independently.
 * Returns all 80 questions in world order (world 0 first, world 7 last).
 */
export function generateSessionQuestions() {
  const byWorld = {};
  for (let w = 0; w < 8; w++) byWorld[w] = [];
  ALL_QUESTIONS.forEach(q => byWorld[q.world].push({ ...q }));

  // Fisher-Yates shuffle per world
  for (let w = 0; w < 8; w++) {
    const arr = byWorld[w];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Flatten back
  return Object.values(byWorld).flat();
}

export default ALL_QUESTIONS;

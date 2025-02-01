/**
 * Example spaced repetition algorithm logic
 * 
 * E-Factor (easiness factor) approach:
 * - Each card has an easiness factor (EF), initially 2.5.
 * - After each review, update EF based on user performance (rating: 1-5).
 * - The interval between reviews is adjusted accordingly.
 * - This is a simplified version; adapt as needed.
 */

export interface Card {
    id: string;
    question: string;
    answer: string;
    interval: number;   // days
    eFactor: number;    // easiness factor
    dueDate: string;    // iso date
    // etc.
  }
  
  export function updateCard(card: Card, performanceRating: number): Card {
    // 1. Adjust EF
    const newEF = calculateEF(card.eFactor, performanceRating);
    // 2. Calculate new interval
    let newInterval = 1; // default
    if (performanceRating >= 3) {
      if (card.interval === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(card.interval * newEF);
      }
    } else {
      // if user fails or rates poorly
      newInterval = 1;
    }
  
    // 3. Calculate new due date
    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + newInterval);
  
    return {
      ...card,
      interval: newInterval,
      eFactor: newEF,
      dueDate: newDueDate.toISOString()
    };
  }
  
  function calculateEF(oldEF: number, performanceRating: number) {
    // EF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // simplified adaptation
    const delta = 0.1 - (5 - performanceRating) * (0.08 + (5 - performanceRating) * 0.02);
    let newEF = oldEF + delta;
    if (newEF < 1.3) newEF = 1.3; // EF should not go below 1.3
    return newEF;
  }
  
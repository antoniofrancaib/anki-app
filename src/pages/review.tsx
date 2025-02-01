import React, { useEffect, useState } from "react";
import { useSpacedRepetition } from "../hooks/useSpacedRepetition";
import styles from "../styles/Review.module.css";

const initialCards = [
  {
    id: "1",
    question: "What is React?",
    answer: "A JavaScript library for building user interfaces",
    interval: 1,
    eFactor: 2.5,
    dueDate: new Date().toISOString()
  },
  {
    id: "2",
    question: "What is Next.js?",
    answer: "A React framework with hybrid static & server rendering",
    interval: 1,
    eFactor: 2.5,
    dueDate: new Date().toISOString()
  }
];

export default function Review() {
  const { cards, handleReview } = useSpacedRepetition(initialCards);
  const [showAnswer, setShowAnswer] = useState<string | null>(null);
  const [studyStats, setStudyStats] = useState({
    cardsReviewed: 0,
    streakDays: 5, // This should come from your backend
  });

  // Filter cards due today
  const cardsDue = cards.filter((c) => {
    const due = new Date(c.dueDate).getTime();
    return due <= Date.now();
  });

  const handlePerformance = (cardId: string, rating: number) => {
    handleReview(cardId, rating);
    setShowAnswer(null);
    setStudyStats(prev => ({
      ...prev,
      cardsReviewed: prev.cardsReviewed + 1
    }));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Memory Master</h1>
        <p className={styles.subtitle}>Your Personal Spaced Repetition Learning System</p>
      </header>

      <div className={styles.statsSection}>
        <div className={styles.statCard}>
          <h3>Today's Progress</h3>
          <p>{studyStats.cardsReviewed} cards reviewed</p>
          <p>{cardsDue.length} cards remaining</p>
        </div>
        <div className={styles.statCard}>
          <h3>Study Streak</h3>
          <p>{studyStats.streakDays} days</p>
          <p>Keep it up! 🔥</p>
        </div>
      </div>

      <div className={styles.reviewSection}>
        {cardsDue.length === 0 ? (
          <div className={styles.completedMessage}>
            <h2>🎉 All Done!</h2>
            <p>You've completed all your reviews for today.</p>
            <p>Come back tomorrow for new cards!</p>
          </div>
        ) : (
          cardsDue.map((card) => (
            <div key={card.id} className={styles.card}>
              <div className={styles.questionSection}>
                <h3>Question:</h3>
                <p className={styles.question}>{card.question}</p>
                {showAnswer !== card.id && (
                  <button 
                    className={styles.showAnswerBtn}
                    onClick={() => setShowAnswer(card.id)}
                  >
                    Show Answer
                  </button>
                )}
              </div>

              {showAnswer === card.id && (
                <div className={styles.answerSection}>
                  <h3>Answer:</h3>
                  <p className={styles.answer}>{card.answer}</p>
                  <div className={styles.ratingSection}>
                    <p>How well did you know this?</p>
                    <div className={styles.ratingButtons}>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          className={styles.ratingBtn}
                          onClick={() => handlePerformance(card.id, rating)}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                    <div className={styles.ratingGuide}>
                      <span>Difficult</span>
                      <span>Perfect</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

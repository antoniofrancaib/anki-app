import { useState } from "react";
import { Card, updateCard } from "../lib/spacedRepetition";

export function useSpacedRepetition(initialCards: Card[]) {
  const [cards, setCards] = useState<Card[]>(initialCards);

  const handleReview = (cardId: string, performanceRating: number) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          return updateCard(card, performanceRating);
        }
        return card;
      })
    );
  };

  return {
    cards,
    handleReview
  };
}

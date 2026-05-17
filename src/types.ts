export type Answer = {
  id: number;
  text: string;
};

// Shared quiz question shape consumed by top-level state and card components.
export type QuizQuestion = {
  question: string;
  answers: Answer[];
  correctAnswer: {
    id: number;
  };
};

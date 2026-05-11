export type Answer = {
  id: number;
  text: string;
};

export type QuizQuestion = {
  question: string;
  answers: Answer[];
  correctAnswer: {
    id: number;
  };
};

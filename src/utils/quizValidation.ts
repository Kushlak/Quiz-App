import { QuizQuestion } from "../types";

export function isQuizQuestion(value: unknown): value is QuizQuestion {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const possibleQuestion = value as Partial<QuizQuestion>;

  return (
    typeof possibleQuestion.question === "string" &&
    Array.isArray(possibleQuestion.answers) &&
    possibleQuestion.answers.length > 0 &&
    possibleQuestion.answers.every(
      (answer) =>
        typeof answer.id === "number" && typeof answer.text === "string",
    ) &&
    typeof possibleQuestion.correctAnswer === "object" &&
    possibleQuestion.correctAnswer !== null &&
    typeof possibleQuestion.correctAnswer.id === "number" &&
    possibleQuestion.answers.some(
      (answer) => answer.id === possibleQuestion.correctAnswer?.id,
    )
  );
}

export function hasDuplicateAnswerTexts(answerTexts: string[]) {
  const normalizedAnswers = answerTexts.map((answer) => answer.toLowerCase());

  return new Set(normalizedAnswers).size !== answerTexts.length;
}

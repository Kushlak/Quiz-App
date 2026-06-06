import { Answer, QuizQuestion } from "../types";
import { hasDuplicateAnswerTexts } from "./quizValidation";

function normalizeImportedQuestion(value: unknown): QuizQuestion | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const importedQuestion = value as {
    question?: unknown;
    answers?: unknown;
    correctAnswer?: unknown;
  };

  if (
    typeof importedQuestion.question !== "string" ||
    !Array.isArray(importedQuestion.answers)
  ) {
    return null;
  }

  const answerTexts = importedQuestion.answers.map((answer) => {
    if (typeof answer === "string") {
      return answer.trim();
    }

    if (typeof answer === "object" && answer !== null) {
      const possibleAnswer = answer as Partial<Answer>;

      if (typeof possibleAnswer.text === "string") {
        return possibleAnswer.text.trim();
      }
    }

    return "";
  });

  if (
    importedQuestion.question.trim() === "" ||
    answerTexts.length < 2 ||
    answerTexts.some((answer) => answer === "") ||
    hasDuplicateAnswerTexts(answerTexts)
  ) {
    return null;
  }

  const correctAnswer = importedQuestion.correctAnswer;
  const correctAnswerId =
    typeof correctAnswer === "object" && correctAnswer !== null
      ? (correctAnswer as { id?: unknown }).id
      : correctAnswer;

  if (
    typeof correctAnswerId !== "number" ||
    !Number.isInteger(correctAnswerId) ||
    correctAnswerId < 1 ||
    correctAnswerId > answerTexts.length
  ) {
    return null;
  }

  return {
    question: importedQuestion.question.trim(),
    answers: answerTexts.map((answer, index) => ({
      id: index + 1,
      text: answer,
    })),
    correctAnswer: {
      id: correctAnswerId,
    },
  };
}

export async function parseImportedQuizJson(rawJson: string) {
  const jsonText = await new Blob([rawJson]).text();
  const parsedJson = JSON.parse(jsonText) as unknown;
  const importedQuiz =
    typeof parsedJson === "object" && parsedJson !== null
      ? (parsedJson as { title?: unknown; questions?: unknown })
      : null;
  const rawQuestions = Array.isArray(parsedJson)
    ? parsedJson
    : Array.isArray(importedQuiz?.questions)
      ? importedQuiz.questions
      : null;

  if (rawQuestions === null) {
    throw new Error("Paste a JSON array or an object with a questions array.");
  }

  const questions = rawQuestions.map(normalizeImportedQuestion);

  if (questions.some((question) => question === null)) {
    throw new Error(
      "Each imported question needs text, unique answers, and a valid correctAnswer id.",
    );
  }

  return {
    title: typeof importedQuiz?.title === "string" ? importedQuiz.title : "",
    questions: questions as QuizQuestion[],
  };
}

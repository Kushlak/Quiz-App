import { useState } from "react";
import NextQuestionButton from "./components/NextQuestionButton";
import QuizCard from "./components/QuizCard";
import QuizContainer from "./components/QuizContainer";
import FinishQuiz from "./components/FinishQuiz";
import { Answer, QuizQuestion } from "./types";

// Static quiz content used to render each question and validate answers.
const quizData: QuizQuestion[] = [
  {
    question: "How many semitones are in one octave?",
    answers: [
      { id: 1, text: "8" },
      { id: 2, text: "10" },
      { id: 3, text: "12" },
      { id: 4, text: "14" },
    ],
    correctAnswer: { id: 3 },
  },
  {
    question: "Which key signature has one sharp?",
    answers: [
      { id: 1, text: "G major" },
      { id: 2, text: "D major" },
      { id: 3, text: "F major" },
      { id: 4, text: "C major" },
    ],
    correctAnswer: { id: 1 },
  },
  {
    question: "What is the relative minor of C major?",
    answers: [
      { id: 1, text: "E minor" },
      { id: 2, text: "A minor" },
      { id: 3, text: "D minor" },
      { id: 4, text: "G minor" },
    ],
    correctAnswer: { id: 2 },
  },
];

function App() {
  // Local state tracks score, chosen answers, per-question feedback, and finish status.
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(Answer | null)[]>(
    quizData.map(() => null),
  );
  const [feedbacks, setFeedbacks] = useState<string[]>(quizData.map(() => ""));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Accept a single answer per question and compute immediate feedback.
  function handleAnswerClick(questionIndex: number, answer: Answer) {
    if (selectedAnswers[questionIndex]) {
      return;
    }

    const nextSelectedAnswers = [...selectedAnswers];
    nextSelectedAnswers[questionIndex] = answer;
    setSelectedAnswers(nextSelectedAnswers);

    const question = quizData[questionIndex];

    // Correct choices increment score; incorrect choices show the right answer text.
    if (answer.id === question.correctAnswer.id) {
      const nextFeedbacks = [...feedbacks];
      nextFeedbacks[questionIndex] = "Correct!";
      setFeedbacks(nextFeedbacks);
      setScore((prev) => prev + 1);
    } else {
      const nextFeedbacks = [...feedbacks];
      nextFeedbacks[questionIndex] = `Wrong! Correct answer: ${question.answers.find((a) => a.id === question.correctAnswer.id)?.text}`;
      setFeedbacks(nextFeedbacks);
    }
  }

  // Moves through one question at a time and finishes from the final card.
  function handleNextQuestion() {
    if (!selectedAnswers[currentQuestionIndex]) {
      return;
    }

    if (currentQuestionIndex === quizData.length - 1) {
      setQuizFinished(true);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  }

  // Restores initial state so the user can replay the quiz.
  function handleRetryQuiz() {
    setScore(0);
    setSelectedAnswers(quizData.map(() => null));
    setFeedbacks(quizData.map(() => ""));
    setCurrentQuestionIndex(0);
    setQuizFinished(false);
  }

  const currentQuestion = quizData[currentQuestionIndex];
  const currentAnswer = selectedAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.length - 1;

  return (
    <>
      {quizFinished ? (
        <FinishQuiz
          score={score}
          totalQuestions={quizData.length}
          onRetry={handleRetryQuiz}
        />
      ) : (
        <QuizContainer title="Music Theory Quiz">
          <QuizCard
            current={currentQuestionIndex + 1}
            total={quizData.length}
            question={currentQuestion.question}
            answers={currentQuestion.answers}
            onAnswerClick={(answer) =>
              handleAnswerClick(currentQuestionIndex, answer)
            }
            feedback={feedbacks[currentQuestionIndex]}
          />

          <NextQuestionButton
            onClick={handleNextQuestion}
            disabled={!currentAnswer}
            text={isLastQuestion ? "Finish Quiz" : "Next Question"}
          />
        </QuizContainer>
      )}
    </>
  );
}

export default App;

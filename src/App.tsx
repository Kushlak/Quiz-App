import { useState } from "react";
import NextQuestionButton from "./components/NextQuestionButton";
import QuizCard from "./components/QuizCard";
import QuizContainer from "./components/QuizContainer";
import FinishQuiz from "./components/FinishQuiz";
import { Answer, QuizQuestion } from "./types";

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
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(Answer | null)[]>(
    quizData.map(() => null),
  );
  const [feedbacks, setFeedbacks] = useState<string[]>(quizData.map(() => ""));
  const [quizFinished, setQuizFinished] = useState(false);

  function handleAnswerClick(questionIndex: number, answer: Answer) {
    if (selectedAnswers[questionIndex]) {
      return;
    }

    const nextSelectedAnswers = [...selectedAnswers];
    nextSelectedAnswers[questionIndex] = answer;
    setSelectedAnswers(nextSelectedAnswers);

    const question = quizData[questionIndex];

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

  function handleFinishQuiz() {
    if (!selectedAnswers.every((answer) => answer !== null)) {
      return;
    }

    setQuizFinished(true);
  }

  function handleRetryQuiz() {
    setScore(0);
    setSelectedAnswers(quizData.map(() => null));
    setFeedbacks(quizData.map(() => ""));
    setQuizFinished(false);
  }

  const allAnswered = selectedAnswers.every((answer) => answer !== null);

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
          <div className="quiz-list">
            {quizData.map((question, index) => (
              <QuizCard
                key={index}
                current={index + 1}
                total={quizData.length}
                question={question.question}
                answers={question.answers}
                onAnswerClick={(answer) => handleAnswerClick(index, answer)}
                feedback={feedbacks[index]}
              />
            ))}
          </div>

          <NextQuestionButton
            onClick={handleFinishQuiz}
            disabled={!allAnswered}
            text="Finish Quiz"
          />
        </QuizContainer>
      )}
    </>
  );
}

export default App;

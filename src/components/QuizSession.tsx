import { useState } from "react";
import { Answer, QuizQuestion } from "../types";
import FinishQuiz from "./FinishQuiz";
import QuizScreen from "../screens/QuizScreen";

type Props = {
  title: string;
  questions: QuizQuestion[];
  includesPianoHelper: boolean;
  onMenu: () => void;
};

function QuizSession({ title, questions, includesPianoHelper, onMenu }: Props) {
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(Answer | null)[]>(
    questions.map(() => null),
  );
  const [feedbacks, setFeedbacks] = useState<string[]>(questions.map(() => ""));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  function resetQuiz() {
    setScore(0);
    setSelectedAnswers(questions.map(() => null));
    setFeedbacks(questions.map(() => ""));
    setCurrentQuestionIndex(0);
    setQuizFinished(false);
  }

  function handleAnswerClick(questionIndex: number, answer: Answer) {
    if (selectedAnswers[questionIndex]) {
      return;
    }

    const nextSelectedAnswers = [...selectedAnswers];
    nextSelectedAnswers[questionIndex] = answer;
    setSelectedAnswers(nextSelectedAnswers);

    const question = questions[questionIndex];
    const nextFeedbacks = [...feedbacks];

    if (answer.id === question.correctAnswer.id) {
      nextFeedbacks[questionIndex] = "Correct!";
      setScore((prev) => prev + 1);
    } else {
      const correctAnswer = question.answers.find(
        (quizAnswer) => quizAnswer.id === question.correctAnswer.id,
      );
      nextFeedbacks[questionIndex] = `Wrong! Correct answer: ${correctAnswer?.text}`;
    }

    setFeedbacks(nextFeedbacks);
  }

  function handleNextQuestion() {
    if (!selectedAnswers[currentQuestionIndex]) {
      return;
    }

    if (currentQuestionIndex === questions.length - 1) {
      setQuizFinished(true);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  }

  if (quizFinished) {
    return (
      <FinishQuiz
        score={score}
        totalQuestions={questions.length}
        onRetry={resetQuiz}
        onMenu={onMenu}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = selectedAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <QuizScreen
      title={title}
      currentQuestion={currentQuestion}
      currentQuestionIndex={currentQuestionIndex}
      totalQuestions={questions.length}
      currentAnswer={currentAnswer}
      feedback={feedbacks[currentQuestionIndex]}
      includesPianoHelper={includesPianoHelper}
      isLastQuestion={isLastQuestion}
      onAnswerClick={(answer) => handleAnswerClick(currentQuestionIndex, answer)}
      onNextQuestion={handleNextQuestion}
      onFinishQuiz={() => setQuizFinished(true)}
    />
  );
}

export default QuizSession;

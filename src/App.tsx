import { useState } from "react";
import NextQuestionButton from "./components/NextQuestionButton";
import QuizCard from "./components/QuizCard";
import QuizContainer from "./components/QuizContainer";
import FinishQuiz from "./components/FinishQuiz";
import MiniPianoHelper from "./components/MiniPianoHelper";
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
  {
    question: "What does a sharp symbol do to a note?",
    answers: [
      { id: 1, text: "Raises it by a semitone" },
      { id: 2, text: "Lowers it by a semitone" },
      { id: 3, text: "Raises it by an octave" },
      { id: 4, text: "Makes it silent" },
    ],
    correctAnswer: { id: 1 },
  },
  {
    question: "How many beats does a quarter note usually get in 4/4 time?",
    answers: [
      { id: 1, text: "Half a beat" },
      { id: 2, text: "One beat" },
      { id: 3, text: "Two beats" },
      { id: 4, text: "Four beats" },
    ],
    correctAnswer: { id: 2 },
  },
  {
    question: "Which clef is commonly used for higher-pitched instruments?",
    answers: [
      { id: 1, text: "Bass clef" },
      { id: 2, text: "Alto clef" },
      { id: 3, text: "Treble clef" },
      { id: 4, text: "Tenor clef" },
    ],
    correctAnswer: { id: 3 },
  },
  {
    question: "What interval is formed by C up to G?",
    answers: [
      { id: 1, text: "Perfect fourth" },
      { id: 2, text: "Perfect fifth" },
      { id: 3, text: "Major sixth" },
      { id: 4, text: "Minor seventh" },
    ],
    correctAnswer: { id: 2 },
  },
  {
    question: "Which time signature has four quarter-note beats per measure?",
    answers: [
      { id: 1, text: "2/4" },
      { id: 2, text: "3/4" },
      { id: 3, text: "4/4" },
      { id: 4, text: "6/8" },
    ],
    correctAnswer: { id: 3 },
  },
  {
    question: "What is the dominant note in the C major scale?",
    answers: [
      { id: 1, text: "C" },
      { id: 2, text: "E" },
      { id: 3, text: "G" },
      { id: 4, text: "B" },
    ],
    correctAnswer: { id: 3 },
  },
  {
    question: "Which major scale has no sharps or flats?",
    answers: [
      { id: 1, text: "C major" },
      { id: 2, text: "G major" },
      { id: 3, text: "F major" },
      { id: 4, text: "D major" },
    ],
    correctAnswer: { id: 1 },
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

          <MiniPianoHelper />

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

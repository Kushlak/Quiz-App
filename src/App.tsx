import { useState } from "react";

type QuizQuestion = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

const quizData: QuizQuestion[] = [
  {
    question: "How many semitones are in one octave?",
    answers: ["8", "10", "12", "14"],
    correctAnswer: "12",
  },
  {
    question: "Which key signature has one sharp?",
    answers: ["G major", "D major", "F major", "C major"],
    correctAnswer: "G major",
  },
  {
    question: "What is the relative minor of C major?",
    answers: ["E minor", "A minor", "D minor", "G minor"],
    correctAnswer: "A minor",
  },
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];

  function handleAnswerClick(answer: string) {
    if (selectedAnswer) {
      return;
    }

    setSelectedAnswer(answer);

    if (answer === currentQuestion.correctAnswer) {
      setFeedback("Correct!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(`Wrong! Correct answer: ${currentQuestion.correctAnswer}`);
    }
  }

  function handleNextQuestion() {
    const isLastQuestion = currentQuestionIndex === quizData.length - 1;

    if (isLastQuestion) {
      setQuizFinished(true);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswer("");
    setFeedback("");
  }

  if (quizFinished) {
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">Music Theory Quiz</h1>
        <div className="quiz-card">
          <h2>Quiz finished!</h2>
          <p className="final-score">
            Your score: {score} / {quizData.length}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Music Theory Quiz</h1>

      <div className="quiz-card">
        <p className="progress">
          Question {currentQuestionIndex + 1} of {quizData.length}
        </p>

        <h2 className="question">{currentQuestion.question}</h2>

        <div className="answers">
          {currentQuestion.answers.map((answer) => (
            <button
              key={answer}
              className="answer-btn"
              onClick={() => handleAnswerClick(answer)}
            >
              {answer}
            </button>
          ))}
        </div>

        <p className="feedback">{feedback}</p>

        <button
          className="next-btn"
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
        >
          Next Question
        </button>
      </div>
    </div>
  );
}

export default App;

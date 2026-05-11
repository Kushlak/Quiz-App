import { useState } from "react";

type QuizQuestion = {
  question: string;
  answers: {
    id: number;
    text: string;
  }[];
  correctAnswer: {
    id: number;
  };
};

const quizData: QuizQuestion[] = [
  {
    question: "How many semitones are in one octave?",
    answers: [{id: 1, text: "8"}, {id: 2, text: "10"}, {id: 3, text: "12"}, {id: 4, text: "14"}],
    correctAnswer: {id: 3},
  },
  {
    question: "Which key signature has one sharp?",
    answers: [{id: 1, text: "G major"}, {id: 2, text: "D major"}, {id: 3, text: "F major"}, {id: 4, text: "C major"}],
    correctAnswer: {id: 1},
  },
  {
    question: "What is the relative minor of C major?",
    answers: [{id: 1, text: "E minor"}, {id: 2, text: "A minor"}, {id: 3, text: "D minor"}, {id:4, text: "G minor"}],
    correctAnswer: {id: 2},
  },
];

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<{ id: number; text: string } | "">("");
  const [feedback, setFeedback] = useState("");
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQuestion = quizData[currentQuestionIndex];

  function handleAnswerClick(answer: { id: number; text: string }) {
    if (selectedAnswer) {
      return;
    }

    setSelectedAnswer(answer);

    if (answer.id === currentQuestion.correctAnswer.id) {
      setFeedback("Correct!");
      setScore((prev) => prev + 1);
    } else {
      setFeedback(`Wrong! Correct answer: ${currentQuestion.correctAnswer.id}`);
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
              key={answer.id}
              className="answer-btn"
              onClick={() => handleAnswerClick(answer)}
            >
              {answer.text}
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

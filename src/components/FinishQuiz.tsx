import QuizCard from "./QuizCard";
import QuizContainer from "./QuizContainer";

type Props = {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
  onMenu: () => void;
};

const FinishQuiz = ({ score, totalQuestions, onRetry, onMenu }: Props) => {
  return (
    <QuizContainer title="Music Theory Quiz">
      <QuizCard>
        <h2>Quiz finished!</h2>
        <p className="final-score">
          Your score: {score} / {totalQuestions}
        </p>
        <div className="finish-actions">
          <button className="next-btn" onClick={onRetry}>
            Try Again
          </button>
          <button className="secondary-btn" onClick={onMenu}>
            Go to Menu
          </button>
        </div>
      </QuizCard>
    </QuizContainer>
  );
};

export default FinishQuiz;

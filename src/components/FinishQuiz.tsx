import QuizCard from "./QuizCard";
import QuizContainer from "./QuizContainer";

type Props = {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
};

const FinishQuiz = ({ score, totalQuestions, onRetry }: Props) => {
  return (
    <QuizContainer title="Music Theory Quiz">
      <QuizCard>
        <h2>Quiz finished!</h2>
        <p className="final-score">
          Your score: {score} / {totalQuestions}
        </p>
        <button className="next-btn" onClick={onRetry}>
          Try Again
        </button>
      </QuizCard>
    </QuizContainer>
  );
};

export default FinishQuiz;

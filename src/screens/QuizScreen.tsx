import MiniPianoHelper from "../components/MiniPianoHelper";
import NextQuestionButton from "../components/NextQuestionButton";
import QuizCard from "../components/QuizCard";
import QuizContainer from "../components/QuizContainer";
import { Answer, QuizQuestion } from "../types";

type Props = {
  title: string;
  currentQuestion: QuizQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  currentAnswer: Answer | null;
  feedback: string;
  includesPianoHelper: boolean;
  isLastQuestion: boolean;
  onAnswerClick: (answer: Answer) => void;
  onNextQuestion: () => void;
  onFinishQuiz: () => void;
};

function QuizScreen({
  title,
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  currentAnswer,
  feedback,
  includesPianoHelper,
  isLastQuestion,
  onAnswerClick,
  onNextQuestion,
  onFinishQuiz,
}: Props) {
  return (
    <QuizContainer title={title}>
      <div className="quiz-main">
        <QuizCard
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          question={currentQuestion.question}
          answers={currentQuestion.answers}
          onAnswerClick={onAnswerClick}
          feedback={feedback}
        />

        {includesPianoHelper && <MiniPianoHelper />}

        <div className="quiz-actions">
          <NextQuestionButton
            onClick={onNextQuestion}
            disabled={!currentAnswer}
            text={isLastQuestion ? "Finish Quiz" : "Next Question"}
          />
          <button
            className="secondary-btn"
            type="button"
            onClick={onFinishQuiz}
          >
            Finish Quiz Now
          </button>
        </div>
      </div>
    </QuizContainer>
  );
}

export default QuizScreen;

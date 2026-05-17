import { ReactNode } from "react";
import { Answer } from "../types";
import AnswerButtons from "./AnswerButtons";
import QuizProgress from "./QuizProgress";

type Props = {
  children?: ReactNode;
  current?: number;
  total?: number;
  question?: string;
  answers?: Answer[];
  onAnswerClick?: (answer: Answer) => void;
  feedback?: string;
};

// Supports two modes: full quiz question card or generic content wrapper.
function QuizCard({
  children,
  current,
  total,
  question,
  answers,
  onAnswerClick,
  feedback,
}: Props) {
  const canRenderQuizParts =
    current !== undefined &&
    total !== undefined &&
    question !== undefined &&
    answers !== undefined &&
    onAnswerClick !== undefined &&
    feedback !== undefined;

  if (canRenderQuizParts) {
    return (
      <div className="quiz-card">
        <QuizProgress current={current} total={total} />
        <h2 className="question">{question}</h2>
        <AnswerButtons answers={answers} onAnswerClick={onAnswerClick} />
        <p className="feedback">{feedback}</p>
      </div>
    );
  }

  return <div className="quiz-card">{children}</div>;
}

export default QuizCard;

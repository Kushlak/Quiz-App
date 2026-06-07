import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
};

function QuizContainer({ title, children }: Props) {
  return (
    <div className="quiz-container">
      <h1 className="quiz-title">{title}</h1>
      {children}
    </div>
  );
}

export default QuizContainer;

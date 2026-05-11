import { Answer } from "../types";

type Props = {
  answers: Answer[];
  onAnswerClick: (answer: Answer) => void;
};

function AnswerButtons({ answers, onAnswerClick }: Props) {
  return (
    <div className="answers">
      {answers.map((answer) => (
        <button
          key={answer.id}
          className="answer-btn"
          onClick={() => onAnswerClick(answer)}
        >
          {answer.text}
        </button>
      ))}
    </div>
  );
}

export default AnswerButtons;

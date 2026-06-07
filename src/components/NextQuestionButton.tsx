type Props = {
  onClick: () => void;
  disabled: boolean;
  text?: string;
};

function NextQuestionButton({ onClick, disabled, text }: Props) {
  return (
    <button className="next-btn" onClick={onClick} disabled={disabled}>
      {text || "Next Question"}
    </button>
  );
}

export default NextQuestionButton;

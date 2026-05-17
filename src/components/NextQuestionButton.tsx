type Props = {
  onClick: () => void;
  disabled: boolean;
  text?: string;
};

// Reusable primary button used for quiz progression actions.
function NextQuestionButton({ onClick, disabled, text }: Props) {
  return (
    <button className="next-btn" onClick={onClick} disabled={disabled}>
      {text || "Next Question"}
    </button>
  );
}

export default NextQuestionButton;

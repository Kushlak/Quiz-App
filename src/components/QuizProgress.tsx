type Props = {
  current: number;
  total: number;
};

// Displays current question index for simple progress feedback.
function QuizProgress({ current, total }: Props) {
  return (
    <p className="progress">
      Question {current} of {total}
    </p>
  );
}

export default QuizProgress;

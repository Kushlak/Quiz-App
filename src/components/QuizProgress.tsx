type Props = {
  current: number;
  total: number;
};

function QuizProgress({ current, total }: Props) {
  return (
    <p className="progress">
      Question {current} of {total}
    </p>
  );
}

export default QuizProgress;

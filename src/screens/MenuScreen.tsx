import MusicFunFact from "../components/MusicFunFact";
import QuizCard from "../components/QuizCard";
import QuizContainer from "../components/QuizContainer";
type Props = {
  savedQuizTitle: string;
  hasSavedQuestions: boolean;
  onStartMusicQuiz: () => void;
  onStartSavedQuiz: () => void;
  onCreateNewQuiz: () => void;
};

function MenuScreen({
  savedQuizTitle,
  hasSavedQuestions,
  onStartMusicQuiz,
  onStartSavedQuiz,
  onCreateNewQuiz,
}: Props) {
  return (
    <div className="menu-screen">
      <MusicFunFact />
      <QuizContainer title="Music Theory Quiz">
        <QuizCard>
          <div className="menu-actions">
            <button
              className="next-btn"
              type="button"
              onClick={onStartMusicQuiz}
            >
              Start Music Quiz
            </button>
            {hasSavedQuestions && savedQuizTitle !== "" && (
              <button
                className="next-btn"
                type="button"
                onClick={onStartSavedQuiz}
              >
                Start {savedQuizTitle}
              </button>
            )}
            <button
              className="secondary-btn"
              type="button"
              onClick={onCreateNewQuiz}
            >
              Create New Quiz
            </button>
          </div>
        </QuizCard>
      </QuizContainer>
    </div>
  );
}

export default MenuScreen;

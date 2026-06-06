//imports
/* це дочірній компонент
1. Назву збереженого quiz
2. Інформацію, чи є збережені питання
3. Функцію запуску стандартного quiz
4. Функцію запуску збереженого quiz
5. Функцію переходу до створення нового quiz
*/ 
import MusicFunFact from "../components/MusicFunFact";
import QuizCard from "../components/QuizCard";
import QuizContainer from "../components/QuizContainer";
//what manuscreen expects to get from externally
type Props = {
  savedQuizTitle: string;
  hasSavedQuestions: boolean; //is there at lest one question saved, should it show you start saveed quiz or not
  onStartMusicQuiz: () => void;// starts music quiz, no logic, only tells if the user clicked the button, logic in the App.tsx
  onStartSavedQuiz: () => void;// function to start the quiz that user created
  onCreateNewQuiz: () => void;// function that transport user to screen where you cacn create new quiz
};

function MenuScreen({
  //function component, here we create component menuscreen
  savedQuizTitle, // props, it calls destructuring
  hasSavedQuestions,
  onStartMusicQuiz,
  onStartSavedQuiz,
  onCreateNewQuiz,
}: Props) {
  return (
    <div className="menu-screen"> //class for the main wrapper
      <MusicFunFact /> //feature fun fact, do not have props and do not influence logic
      <QuizContainer title="Music Theory Quiz">// in quiz container we transfer prop
        <QuizCard>//beautifull wrapper for buttons
          <div className="menu-actions">
            <button// button of starting quiz
              className="next-btn"
              type="button"
              onClick={onStartMusicQuiz}// start the function from App.tsx handleStartMusicQuiz
            >
              Start Music Quiz
            </button>
            {hasSavedQuestions && savedQuizTitle !== "" && (// rendering, shows when: check if there are title and saved questino
              <button
                className="next-btn" //css class style
                type="button"
                onClick={onStartSavedQuiz}
              >
                Start {savedQuizTitle}
              </button>
            )}
            <button //third button, opens the screen of new quiz
              className="secondary-btn"
              type="button"
              onClick={onCreateNewQuiz}// calls the function
            >
              Create New Quiz
            </button>
          </div>
        </QuizCard>// children
      </QuizContainer>// everething inside is a children, even quiz card
    </div>
  );
}

export default MenuScreen;// allows 

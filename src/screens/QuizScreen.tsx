import MiniPianoHelper from "../components/MiniPianoHelper";
import NextQuestionButton from "../components/NextQuestionButton";
import QuizCard from "../components/QuizCard";
import QuizContainer from "../components/QuizContainer";
import { Answer, QuizQuestion } from "../types";
/*
App.tsx має state:
- currentQuestionIndex
- selectedAnswers
- feedbacks
- quizFinished
- activeQuestions
*/
//screen of  quiz time, does not have logic and does not savess the state, gets all data and function through props, only shows buttons and current question/answers
type Props = {
  title: string;
  currentQuestion: QuizQuestion;//curent question to show
  currentQuestionIndex: number;//index of current question
  totalQuestions: number;
  currentAnswer: Answer | null;//answered or not yet
  feedback: string;
  includesPianoHelper: boolean;
  isLastQuestion: boolean;
  onAnswerClick: (answer: Answer) => void;//callback function, returns nothing but takes an answer so that it knows what user chosed and give it to answerbutton
  onNextQuestion: () => void;//function to go to the next question, app already know the current index
  onFinishQuiz: () => void; //function to finish
};//what it gets from App.tsx

function QuizScreen({//takes props and and destructures it
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
    <QuizContainer title={title}>//main wrapperr quiz screen, takes the title from user, all quiz component is here
      <div className="quiz-main">//main css wrapper for content -spacing, layout
        <QuizCard // card for the cureent question
          current={currentQuestionIndex + 1}//number of current questino for user
          total={totalQuestions}//total amount of question
          question={currentQuestion.question}//text of the question
          answers={currentQuestion.answers}//varients of answers
          onAnswerClick={onAnswerClick}
          feedback={feedback}
        />

        {includesPianoHelper && <MiniPianoHelper />}// if quiz has piano helper - show it

        <div className="quiz-actions">//blok for the buttons under the questions
          <NextQuestionButton // reusable button
            onClick={onNextQuestion}
            disabled={!currentAnswer} // if user have not yet chised the answer - the button is disabled, it becomes active only when user click on the answer and give it to the current answer state
            text={isLastQuestion ? "Finish Quiz" : "Next Question"} //if it is the last question - text in the button finish, if not - next question
          />
          <button
            className="secondary-btn"//gives you the way to finish the quiz now
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

import QuizContainer from "../components/QuizContainer";
import { QuizQuestion } from "../types";

export type CreateMode = "text" | "json";

type Props = {
  createMode: CreateMode;
  createdQuestions: QuizQuestion[];
  correctAnswerIndex: number;
  draftAnswers: string[];
  draftIncludesPianoHelper: boolean;
  draftJsonQuiz: string;
  draftQuestion: string;
  draftQuizTitle: string;
  importMessage: string;
  showsJsonHelp: boolean;
  onAddQuestion: () => void;
  onBack: () => void;
  onDraftAnswerChange: (answerIndex: number, value: string) => void;
  onDraftIncludesPianoHelperChange: (value: boolean) => void;
  onDraftJsonQuizChange: (value: string) => void;
  onDraftQuestionChange: (value: string) => void;
  onDraftQuizTitleChange: (value: string) => void;
  onSaveQuiz: () => void;
  onSetCorrectAnswerIndex: (value: number) => void;
  onSetCreateMode: (mode: CreateMode) => void;
  onStartQuiz: () => void;
  onToggleJsonHelp: () => void;
};

function CreateQuizScreen({
  createMode,
  createdQuestions,
  correctAnswerIndex,
  draftAnswers,
  draftIncludesPianoHelper,
  draftJsonQuiz,
  draftQuestion,
  draftQuizTitle,
  importMessage,
  showsJsonHelp,
  onAddQuestion,
  onBack,
  onDraftAnswerChange,
  onDraftIncludesPianoHelperChange,
  onDraftJsonQuizChange,
  onDraftQuestionChange,
  onDraftQuizTitleChange,
  onSaveQuiz,
  onSetCorrectAnswerIndex,
  onSetCreateMode,
  onStartQuiz,
  onToggleJsonHelp,
}: Props) {
  return (
    <QuizContainer title="Create New Quiz">
      <div className="quiz-main">
        <div className="quiz-builder">
          <label htmlFor="draft-quiz-title">Quiz title</label>
          <input
            id="draft-quiz-title"
            type="text"
            value={draftQuizTitle}
            onChange={(event) => onDraftQuizTitleChange(event.target.value)}
            placeholder="Example: My Music Quiz"
          />

          <div className="create-mode-switcher" aria-label="Create mode">
            <button
              className={createMode === "text" ? "active-mode" : ""}
              type="button"
              onClick={() => onSetCreateMode("text")}
            >
              Text
            </button>
            <button
              className={createMode === "json" ? "active-mode" : ""}
              type="button"
              onClick={() => onSetCreateMode("json")}
            >
              JSON
            </button>
          </div>

          {createMode === "json" ? (
            <>
              <div className="json-import-heading">
                <label htmlFor="draft-json-quiz">
                  Import questions from JSON
                </label>
                <button
                  className="info-btn"
                  type="button"
                  aria-label="Show JSON format help"
                  aria-expanded={showsJsonHelp}
                  onClick={onToggleJsonHelp}
                >
                  i
                </button>
              </div>
              {showsJsonHelp && (
                <div className="json-help">
                  <p>
                    Paste a JSON array of questions, or an object with a title
                    and questions array.
                  </p>
                  <pre>{`{
  "title": "My Quiz",
  "questions": [
    {
      "question": "How many beats are in 4/4?",
      "answers": ["2", "3", "4", "6"],
      "correctAnswer": { "id": 3 }
    }
  ]
}`}</pre>
                </div>
              )}
              <textarea
                id="draft-json-quiz"
                value={draftJsonQuiz}
                onChange={(event) => onDraftJsonQuizChange(event.target.value)}
                placeholder={`[
  {
    "question": "How many beats are in 4/4?",
    "answers": ["2", "3", "4", "6"],
    "correctAnswer": { "id": 3 }
  }
]`}
              />
            </>
          ) : (
            <>
              <label htmlFor="draft-question">Question</label>
              <input
                id="draft-question"
                type="text"
                value={draftQuestion}
                onChange={(event) => onDraftQuestionChange(event.target.value)}
                placeholder="Example: How many semitones are in one octave?"
              />

              <fieldset className="answers-builder">
                <legend>Answers</legend>
                {draftAnswers.map((answer, index) => (
                  <div className="answer-builder-row" key={index}>
                    <input
                      type="radio"
                      name="correct-answer"
                      checked={correctAnswerIndex === index}
                      onChange={() => onSetCorrectAnswerIndex(index)}
                      aria-label={`Mark answer ${index + 1} as correct`}
                    />
                    <label htmlFor={`draft-answer-${index}`}>
                      Answer {index + 1}
                    </label>
                    <input
                      id={`draft-answer-${index}`}
                      type="text"
                      value={answer}
                      onChange={(event) =>
                        onDraftAnswerChange(index, event.target.value)
                      }
                      placeholder={`Answer ${index + 1}`}
                    />
                  </div>
                ))}
              </fieldset>
            </>
          )}

          <label className="helper-option">
            <input
              type="checkbox"
              checked={draftIncludesPianoHelper}
              onChange={(event) =>
                onDraftIncludesPianoHelperChange(event.target.checked)
              }
            />
            Include piano helper
          </label>

          <div className="builder-actions">
            <button className="next-btn" type="button" onClick={onAddQuestion}>
              Add Question
            </button>
            <button
              className="secondary-btn"
              type="button"
              onClick={onSaveQuiz}
              disabled={createdQuestions.length === 0}
            >
              Save Quiz
            </button>
            <button
              className="next-btn"
              type="button"
              onClick={onStartQuiz}
              disabled={createdQuestions.length === 0}
            >
              Start Quiz
            </button>
            <button className="secondary-btn" type="button" onClick={onBack}>
              Back
            </button>
          </div>

          <p className="import-message">{importMessage}</p>

          <div className="created-questions">
            <h2>Questions added: {createdQuestions.length}</h2>
            {createdQuestions.length > 0 && (
              <ol>
                {createdQuestions.map((question, index) => (
                  <li key={`${question.question}-${index}`}>
                    {question.question}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </QuizContainer>
  );
}

export default CreateQuizScreen;

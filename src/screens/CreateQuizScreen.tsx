import { useState } from "react";
import QuizContainer from "../components/QuizContainer";
import { QuizQuestion } from "../types";
import { parseImportedQuizJson } from "../utils/quizImport";
import {
  hasDuplicateAnswerTexts,
  isQuizQuestion,
} from "../utils/quizValidation";
/*
App.tsx керує екранами і збереженим quiz.
CreateQuizScreen керує формою створення quiz.
*/
export type CreateMode = "text" | "json";//two modes of creating

type CreatedQuiz = {//the form of the fully ready quiz
  title: string;
  questions: QuizQuestion[];
  includesPianoHelper: boolean;
};

type Props = {//three callback function
  onBack: () => void;
  onSaveQuiz: (quiz: CreatedQuiz) => void;//function to save the quiz and give it to app.tsx
  onStartQuiz: (quiz: CreatedQuiz) => void;
};

function CreateQuizScreen({ onBack, onSaveQuiz, onStartQuiz }: Props) {
  //quiz is ready - start it
  const [importMessage, setImportMessage] = useState(""); //big amount of useSrart, because it is form
  //Question added.Fill in all answer fields.Imported 3 question(s).
  const [draftQuizTitle, setDraftQuizTitle] = useState(""); //Quiz title
  const [createMode, setCreateMode] = useState<CreateMode>("text"); //text або json, text - default
  const [draftJsonQuiz, setDraftJsonQuiz] = useState("");//json that user pasted in textarea
  const [showsJsonHelp, setShowsJsonHelp] = useState(false);//true - open, false - closed
  const [draftQuestion, setDraftQuestion] = useState("");//saves the question that user wroted
  const [draftAnswers, setDraftAnswers] = useState(["", "", "", ""]);//four places for the answers, firstly the are empty
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);//saves indexof the right answer
  const [createdQuestions, setCreatedQuestions] = useState<QuizQuestion[]>([]);//array of questions that user already added
  const [draftIncludesPianoHelper, setDraftIncludesPianoHelper] = useState(true);// checked - you have piano, not checked - you daont have

  function getQuizTitle(fallback: string) {// my quiz
    return draftQuizTitle.trim() || fallback;
  }

  function handleDraftAnswerChange(answerIndex: number, value: string) {
    const nextDraftAnswers = [...draftAnswers];
    nextDraftAnswers[answerIndex] = value;
    setDraftAnswers(nextDraftAnswers);
  }

  async function handleImportJsonQuiz() {
    if (draftJsonQuiz.trim() === "") {
      setImportMessage("Paste quiz JSON before importing.");
      return;
    }

    try {
      const importedQuiz = await parseImportedQuizJson(draftJsonQuiz);

      setCreatedQuestions((prev) => [...prev, ...importedQuiz.questions]);

      if (draftQuizTitle.trim() === "" && importedQuiz.title.trim() !== "") {
        setDraftQuizTitle(importedQuiz.title.trim());
      }

      setDraftJsonQuiz("");
      setImportMessage(
        `Imported ${importedQuiz.questions.length} question(s).`,
      );
    } catch (error) {
      setImportMessage(
        error instanceof Error ? error.message : "Could not import quiz JSON.",
      );
    }
  }

  async function handleAddCreatedQuestion() {
    const trimmedQuestion = draftQuestion.trim();
    const trimmedAnswers = draftAnswers.map((answer) => answer.trim());

    if (trimmedQuestion === "") {
      setImportMessage("Question text is required.");
      return;
    }

    if (trimmedAnswers.some((answer) => answer === "")) {
      setImportMessage("Fill in all answer fields.");
      return;
    }

    if (hasDuplicateAnswerTexts(trimmedAnswers)) {
      setImportMessage("Answers must be different.");
      return;
    }

    const newQuestion: QuizQuestion = {
      question: trimmedQuestion,
      answers: trimmedAnswers.map((answer, index) => ({
        id: index + 1,
        text: answer,
      })),
      correctAnswer: {
        id: correctAnswerIndex + 1,
      },
    };

    const isValid = await Promise.resolve(isQuizQuestion(newQuestion));

    if (!isValid) {
      setImportMessage("Question, answers, and correct answer are required.");
      return;
    }

    setCreatedQuestions((prev) => [...prev, newQuestion]);
    setDraftQuestion("");
    setDraftAnswers(["", "", "", ""]);
    setCorrectAnswerIndex(0);
    setImportMessage("Question added.");
  }

  function handleAddQuestion() {
    if (createMode === "json") {
      void handleImportJsonQuiz();
      return;
    }

    void handleAddCreatedQuestion();
  }

  function handleStartQuiz() {
    if (createdQuestions.length === 0) {
      setImportMessage("Add at least one question before starting.");
      return;
    }

    const quiz = {
      title: getQuizTitle("Custom Quiz"),
      questions: createdQuestions,
      includesPianoHelper: draftIncludesPianoHelper,
    };

    onStartQuiz(quiz);
  }

  function handleSaveQuiz() {
    const trimmedTitle = draftQuizTitle.trim();

    if (trimmedTitle === "") {
      setImportMessage("Quiz title is required.");
      return;
    }

    if (createdQuestions.length === 0) {
      setImportMessage("Add at least one question before saving.");
      return;
    }

    onSaveQuiz({
      title: trimmedTitle,
      questions: createdQuestions,
      includesPianoHelper: draftIncludesPianoHelper,
    });
  }

  return (
    <QuizContainer title="Create New Quiz">
      <div className="quiz-main">
        <div className="quiz-builder">
          <label htmlFor="draft-quiz-title">Quiz title</label>
          <input
            id="draft-quiz-title"
            type="text"
            value={draftQuizTitle}
            onChange={(event) => setDraftQuizTitle(event.target.value)}
            placeholder="Example: My Music Quiz"
          />

          <div className="create-mode-switcher" aria-label="Create mode">
            <button
              className={createMode === "text" ? "active-mode" : ""}
              type="button"
              onClick={() => setCreateMode("text")}
            >
              Text
            </button>
            <button
              className={createMode === "json" ? "active-mode" : ""}
              type="button"
              onClick={() => setCreateMode("json")}
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
                  onClick={() => setShowsJsonHelp((prev) => !prev)}
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
                onChange={(event) => setDraftJsonQuiz(event.target.value)}
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
                onChange={(event) => setDraftQuestion(event.target.value)}
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
                      onChange={() => setCorrectAnswerIndex(index)}
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
                        handleDraftAnswerChange(index, event.target.value)
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
                setDraftIncludesPianoHelper(event.target.checked)
              }
            />
            Include piano helper
          </label>

          <div className="builder-actions">
            <button
              className="next-btn"
              type="button"
              onClick={handleAddQuestion}
            >
              Add Question
            </button>
            <button
              className="secondary-btn"
              type="button"
              onClick={handleSaveQuiz}
              disabled={createdQuestions.length === 0}
            >
              Save Quiz
            </button>
            <button
              className="next-btn"
              type="button"
              onClick={handleStartQuiz}
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

import { useEffect, useState } from "react";
import NextQuestionButton from "./components/NextQuestionButton";
import QuizCard from "./components/QuizCard";
import QuizContainer from "./components/QuizContainer";
import FinishQuiz from "./components/FinishQuiz";
import MiniPianoHelper from "./components/MiniPianoHelper";
import MusicFunFact from "./components/MusicFunFact";
import ThemeSwitcher, { ThemeName } from "./components/ThemeSwitcher";
import { Answer, QuizQuestion } from "./types";

type AppScreen = "menu" | "import" | "quiz";
type CreateMode = "text" | "json";
type ColorThemeVariant = "green" | "pink" | "yellow" | "rainbow";

const colorThemeVariants: ColorThemeVariant[] = [
  "green",
  "pink",
  "yellow",
  "rainbow",
];

// Static quiz content used to render each question and validate answers.
const quizData: QuizQuestion[] = [
  {
    question: "How many semitones are in one octave?",
    answers: [
      { id: 1, text: "8" },
      { id: 2, text: "10" },
      { id: 3, text: "12" },
      { id: 4, text: "14" },
    ],
    correctAnswer: { id: 3 },
  },
  {
    question: "Which key signature has one sharp?",
    answers: [
      { id: 1, text: "G major" },
      { id: 2, text: "D major" },
      { id: 3, text: "F major" },
      { id: 4, text: "C major" },
    ],
    correctAnswer: { id: 1 },
  },
  {
    question: "What is the relative minor of C major?",
    answers: [
      { id: 1, text: "E minor" },
      { id: 2, text: "A minor" },
      { id: 3, text: "D minor" },
      { id: 4, text: "G minor" },
    ],
    correctAnswer: { id: 2 },
  },
  {
    question: "What does a sharp symbol do to a note?",
    answers: [
      { id: 1, text: "Raises it by a semitone" },
      { id: 2, text: "Lowers it by a semitone" },
      { id: 3, text: "Raises it by an octave" },
      { id: 4, text: "Makes it silent" },
    ],
    correctAnswer: { id: 1 },
  },
  {
    question: "How many beats does a quarter note usually get in 4/4 time?",
    answers: [
      { id: 1, text: "Half a beat" },
      { id: 2, text: "One beat" },
      { id: 3, text: "Two beats" },
      { id: 4, text: "Four beats" },
    ],
    correctAnswer: { id: 2 },
  },
  {
    question: "Which clef is commonly used for higher-pitched instruments?",
    answers: [
      { id: 1, text: "Bass clef" },
      { id: 2, text: "Alto clef" },
      { id: 3, text: "Treble clef" },
      { id: 4, text: "Tenor clef" },
    ],
    correctAnswer: { id: 3 },
  },
  {
    question: "What interval is formed by C up to G?",
    answers: [
      { id: 1, text: "Perfect fourth" },
      { id: 2, text: "Perfect fifth" },
      { id: 3, text: "Major sixth" },
      { id: 4, text: "Minor seventh" },
    ],
    correctAnswer: { id: 2 },
  },
  {
    question: "Which time signature has four quarter-note beats per measure?",
    answers: [
      { id: 1, text: "2/4" },
      { id: 2, text: "3/4" },
      { id: 3, text: "4/4" },
      { id: 4, text: "6/8" },
    ],
    correctAnswer: { id: 3 },
  },
  {
    question: "What is the dominant note in the C major scale?",
    answers: [
      { id: 1, text: "C" },
      { id: 2, text: "E" },
      { id: 3, text: "G" },
      { id: 4, text: "B" },
    ],
    correctAnswer: { id: 3 },
  },
  {
    question: "Which major scale has no sharps or flats?",
    answers: [
      { id: 1, text: "C major" },
      { id: 2, text: "G major" },
      { id: 3, text: "F major" },
      { id: 4, text: "D major" },
    ],
    correctAnswer: { id: 1 },
  },
];

function getSavedTheme(): ThemeName {
  const savedTheme = localStorage.getItem("quiz-theme");

  if (savedTheme === "dark" || savedTheme === "color") {
    return savedTheme;
  }

  return "light";
}

function getSavedColorThemeVariant(): ColorThemeVariant {
  const savedVariant = localStorage.getItem("quiz-color-theme");

  if (
    savedVariant === "green" ||
    savedVariant === "pink" ||
    savedVariant === "yellow" ||
    savedVariant === "rainbow"
  ) {
    return savedVariant;
  }

  return "pink";
}

function getRandomColorThemeVariant(currentVariant: ColorThemeVariant) {
  const availableVariants = colorThemeVariants.filter(
    (variant) => variant !== currentVariant,
  );
  const randomIndex = Math.floor(Math.random() * availableVariants.length);

  return availableVariants[randomIndex];
}

function isQuizQuestion(value: unknown): value is QuizQuestion {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const possibleQuestion = value as Partial<QuizQuestion>;

  return (
    typeof possibleQuestion.question === "string" &&
    Array.isArray(possibleQuestion.answers) &&
    possibleQuestion.answers.length > 0 &&
    possibleQuestion.answers.every(
      (answer) =>
        typeof answer.id === "number" && typeof answer.text === "string",
    ) &&
    typeof possibleQuestion.correctAnswer === "object" &&
    possibleQuestion.correctAnswer !== null &&
    typeof possibleQuestion.correctAnswer.id === "number" &&
    possibleQuestion.answers.some(
      (answer) => answer.id === possibleQuestion.correctAnswer?.id,
    )
  );
}

function hasDuplicateAnswerTexts(answerTexts: string[]) {
  const normalizedAnswers = answerTexts.map((answer) => answer.toLowerCase());

  return new Set(normalizedAnswers).size !== answerTexts.length;
}

function normalizeImportedQuestion(value: unknown): QuizQuestion | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const importedQuestion = value as {
    question?: unknown;
    answers?: unknown;
    correctAnswer?: unknown;
  };

  if (
    typeof importedQuestion.question !== "string" ||
    !Array.isArray(importedQuestion.answers)
  ) {
    return null;
  }

  const answerTexts = importedQuestion.answers.map((answer) => {
    if (typeof answer === "string") {
      return answer.trim();
    }

    if (typeof answer === "object" && answer !== null) {
      const possibleAnswer = answer as Partial<Answer>;

      if (typeof possibleAnswer.text === "string") {
        return possibleAnswer.text.trim();
      }
    }

    return "";
  });

  if (
    importedQuestion.question.trim() === "" ||
    answerTexts.length < 2 ||
    answerTexts.some((answer) => answer === "") ||
    hasDuplicateAnswerTexts(answerTexts)
  ) {
    return null;
  }

  const correctAnswer = importedQuestion.correctAnswer;
  const correctAnswerId =
    typeof correctAnswer === "object" && correctAnswer !== null
      ? (correctAnswer as { id?: unknown }).id
      : correctAnswer;

  if (
    typeof correctAnswerId !== "number" ||
    !Number.isInteger(correctAnswerId) ||
    correctAnswerId < 1 ||
    correctAnswerId > answerTexts.length
  ) {
    return null;
  }

  return {
    question: importedQuestion.question.trim(),
    answers: answerTexts.map((answer, index) => ({
      id: index + 1,
      text: answer,
    })),
    correctAnswer: {
      id: correctAnswerId,
    },
  };
}

async function parseImportedQuizJson(rawJson: string) {
  const jsonText = await new Blob([rawJson]).text();
  const parsedJson = JSON.parse(jsonText) as unknown;
  const importedQuiz =
    typeof parsedJson === "object" && parsedJson !== null
      ? (parsedJson as { title?: unknown; questions?: unknown })
      : null;
  const rawQuestions = Array.isArray(parsedJson)
    ? parsedJson
    : Array.isArray(importedQuiz?.questions)
      ? importedQuiz.questions
      : null;

  if (rawQuestions === null) {
    throw new Error("Paste a JSON array or an object with a questions array.");
  }

  const questions = rawQuestions.map(normalizeImportedQuestion);

  if (questions.some((question) => question === null)) {
    throw new Error(
      "Each imported question needs text, unique answers, and a valid correctAnswer id.",
    );
  }

  return {
    title: typeof importedQuiz?.title === "string" ? importedQuiz.title : "",
    questions: questions as QuizQuestion[],
  };
}

function App() {
  // Local state tracks score, chosen answers, per-question feedback, and finish status.
  const [theme, setTheme] = useState<ThemeName>(getSavedTheme);
  const [colorThemeVariant, setColorThemeVariant] =
    useState<ColorThemeVariant>(getSavedColorThemeVariant);
  const [screen, setScreen] = useState<AppScreen>("menu");
  const [questions, setQuestions] = useState<QuizQuestion[]>(quizData);
  const [activeQuizTitle, setActiveQuizTitle] = useState("Music Theory Quiz");
  const [importMessage, setImportMessage] = useState("");
  const [draftQuizTitle, setDraftQuizTitle] = useState("");
  const [createMode, setCreateMode] = useState<CreateMode>("text");
  const [draftJsonQuiz, setDraftJsonQuiz] = useState("");
  const [showsJsonHelp, setShowsJsonHelp] = useState(false);
  const [draftQuestion, setDraftQuestion] = useState("");
  const [draftAnswers, setDraftAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [createdQuestions, setCreatedQuestions] = useState<QuizQuestion[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<QuizQuestion[]>([]);
  const [savedQuizTitle, setSavedQuizTitle] = useState("");
  const [draftIncludesPianoHelper, setDraftIncludesPianoHelper] =
    useState(true);
  const [includesPianoHelper, setIncludesPianoHelper] = useState(true);
  const [savedIncludesPianoHelper, setSavedIncludesPianoHelper] =
    useState(true);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(Answer | null)[]>(
    questions.map(() => null),
  );
  const [feedbacks, setFeedbacks] = useState<string[]>(questions.map(() => ""));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    localStorage.setItem("quiz-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("quiz-color-theme", colorThemeVariant);
  }, [colorThemeVariant]);

  function handleThemeChange(nextTheme: ThemeName) {
    if (nextTheme === "color") {
      setColorThemeVariant((currentVariant) =>
        getRandomColorThemeVariant(currentVariant),
      );
    }

    setTheme(nextTheme);
  }

  function resetQuiz(nextQuestions: QuizQuestion[]) {
    setScore(0);
    setSelectedAnswers(nextQuestions.map(() => null));
    setFeedbacks(nextQuestions.map(() => ""));
    setCurrentQuestionIndex(0);
    setQuizFinished(false);
  }

  function handleStartMusicQuiz() {
    setQuestions(quizData);
    resetQuiz(quizData);
    setActiveQuizTitle("Music Theory Quiz");
    setIncludesPianoHelper(true);
    setImportMessage("");
    setScreen("quiz");
  }

  function handleStartSavedQuiz() {
    if (savedQuestions.length === 0 || savedQuizTitle === "") {
      return;
    }

    setQuestions(savedQuestions);
    resetQuiz(savedQuestions);
    setActiveQuizTitle(savedQuizTitle);
    setIncludesPianoHelper(savedIncludesPianoHelper);
    setImportMessage("");
    setScreen("quiz");
  }

  function handleCreateNewQuiz() {
    setImportMessage("");
    setScreen("import");
  }

  function resetDraftQuestion() {
    setDraftQuestion("");
    setDraftAnswers(["", "", "", ""]);
    setCorrectAnswerIndex(0);
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
      setImportMessage(`Imported ${importedQuiz.questions.length} question(s).`);
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
    resetDraftQuestion();
    setImportMessage("Question added.");
  }

  async function handleStartCreatedQuiz() {
    if (createdQuestions.length === 0) {
      setImportMessage("Add at least one question before starting.");
      return;
    }

    const nextQuestions = await Promise.resolve(createdQuestions);
    setQuestions(nextQuestions);
    resetQuiz(nextQuestions);
    setActiveQuizTitle(draftQuizTitle.trim() || "Custom Quiz");
    setIncludesPianoHelper(draftIncludesPianoHelper);
    setSavedQuestions(nextQuestions);
    setSavedQuizTitle(draftQuizTitle.trim() || "Custom Quiz");
    setSavedIncludesPianoHelper(draftIncludesPianoHelper);
    setImportMessage("");
    setScreen("quiz");
  }

  async function handleSaveCreatedQuiz() {
    const trimmedTitle = draftQuizTitle.trim();

    if (trimmedTitle === "") {
      setImportMessage("Quiz title is required.");
      return;
    }

    if (createdQuestions.length === 0) {
      setImportMessage("Add at least one question before saving.");
      return;
    }

    const nextQuestions = await Promise.resolve(createdQuestions);
    setSavedQuestions(nextQuestions);
    setSavedQuizTitle(trimmedTitle);
    setSavedIncludesPianoHelper(draftIncludesPianoHelper);
    setImportMessage("");
    setScreen("menu");
  }

  // Accept a single answer per question and compute immediate feedback.
  function handleAnswerClick(questionIndex: number, answer: Answer) {
    if (selectedAnswers[questionIndex]) {
      return;
    }

    const nextSelectedAnswers = [...selectedAnswers];
    nextSelectedAnswers[questionIndex] = answer;
    setSelectedAnswers(nextSelectedAnswers);

    const question = questions[questionIndex];

    // Correct choices increment score; incorrect choices show the right answer text.
    if (answer.id === question.correctAnswer.id) {
      const nextFeedbacks = [...feedbacks];
      nextFeedbacks[questionIndex] = "Correct!";
      setFeedbacks(nextFeedbacks);
      setScore((prev) => prev + 1);
    } else {
      const nextFeedbacks = [...feedbacks];
      nextFeedbacks[questionIndex] = `Wrong! Correct answer: ${question.answers.find((a) => a.id === question.correctAnswer.id)?.text}`;
      setFeedbacks(nextFeedbacks);
    }
  }

  // Moves through one question at a time and finishes from the final card.
  function handleNextQuestion() {
    if (!selectedAnswers[currentQuestionIndex]) {
      return;
    }

    if (currentQuestionIndex === questions.length - 1) {
      setQuizFinished(true);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  }

  function handleFinishQuiz() {
    setQuizFinished(true);
  }

  // Restores initial state so the user can replay the quiz.
  function handleRetryQuiz() {
    resetQuiz(questions);
    setScreen("quiz");
  }

  function handleGoToMenu() {
    setQuizFinished(false);
    setScreen("menu");
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = selectedAnswers[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div
      className={`app-shell theme-${theme} theme-color-${colorThemeVariant}`}
    >
      <ThemeSwitcher theme={theme} onThemeChange={handleThemeChange} />

      {quizFinished ? (
        <FinishQuiz
          score={score}
          totalQuestions={questions.length}
          onRetry={handleRetryQuiz}
          onMenu={handleGoToMenu}
        />
      ) : screen === "menu" ? (
        <div className="menu-screen">
          <MusicFunFact />
          <QuizContainer title="Music Theory Quiz">
            <QuizCard>
              <div className="menu-actions">
                <button
                  className="next-btn"
                  type="button"
                  onClick={handleStartMusicQuiz}
                >
                  Start Music Quiz
                </button>
                {savedQuestions.length > 0 && savedQuizTitle !== "" && (
                  <button
                    className="next-btn"
                    type="button"
                    onClick={handleStartSavedQuiz}
                  >
                    Start {savedQuizTitle}
                  </button>
                )}
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={handleCreateNewQuiz}
                >
                  Create New Quiz
                </button>
              </div>
            </QuizCard>
          </QuizContainer>
        </div>
      ) : screen === "import" ? (
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
                        Paste a JSON array of questions, or an object with a
                        title and questions array.
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
                  onClick={
                    createMode === "json"
                      ? handleImportJsonQuiz
                      : handleAddCreatedQuestion
                  }
                >
                  Add Question
                </button>
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={handleSaveCreatedQuiz}
                  disabled={createdQuestions.length === 0}
                >
                  Save Quiz
                </button>
                <button
                  className="next-btn"
                  type="button"
                  onClick={handleStartCreatedQuiz}
                  disabled={createdQuestions.length === 0}
                >
                  Start Quiz
                </button>
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => setScreen("menu")}
                >
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
      ) : (
        <QuizContainer title={activeQuizTitle}>
          <div className="quiz-main">
            <QuizCard
              current={currentQuestionIndex + 1}
              total={questions.length}
              question={currentQuestion.question}
              answers={currentQuestion.answers}
              onAnswerClick={(answer) =>
                handleAnswerClick(currentQuestionIndex, answer)
              }
              feedback={feedbacks[currentQuestionIndex]}
            />

            {includesPianoHelper && <MiniPianoHelper />}

            <div className="quiz-actions">
              <NextQuestionButton
                onClick={handleNextQuestion}
                disabled={!currentAnswer}
                text={isLastQuestion ? "Finish Quiz" : "Next Question"}
              />
              <button
                className="secondary-btn"
                type="button"
                onClick={handleFinishQuiz}
              >
                Finish Quiz Now
              </button>
            </div>
          </div>
        </QuizContainer>
      )}
    </div>
  );
}

export default App;

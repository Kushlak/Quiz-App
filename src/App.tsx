import { useEffect, useState } from "react";
import FinishQuiz from "./components/FinishQuiz";
import ThemeSwitcher, { ThemeName } from "./components/ThemeSwitcher";
import { quizData } from "./data/quizData";
import CreateQuizScreen, { CreateMode } from "./screens/CreateQuizScreen";
import MenuScreen from "./screens/MenuScreen";
import QuizScreen from "./screens/QuizScreen";
import { Answer, QuizQuestion } from "./types";
import { parseImportedQuizJson } from "./utils/quizImport";
import {
  hasDuplicateAnswerTexts,
  isQuizQuestion,
} from "./utils/quizValidation";
import {
  ColorThemeVariant,
  getRandomColorThemeVariant,
  getSavedColorThemeVariant,
  getSavedTheme,
} from "./utils/themeStorage";

type AppScreen = "menu" | "import" | "quiz";

function App() {
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

  function resetQuiz(nextQuestions: QuizQuestion[]) {
    setScore(0);
    setSelectedAnswers(nextQuestions.map(() => null));
    setFeedbacks(nextQuestions.map(() => ""));
    setCurrentQuestionIndex(0);
    setQuizFinished(false);
  }

  function handleThemeChange(nextTheme: ThemeName) {
    if (nextTheme === "color") {
      setColorThemeVariant((currentVariant) =>
        getRandomColorThemeVariant(currentVariant),
      );
    }

    setTheme(nextTheme);
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

  function handleAnswerClick(questionIndex: number, answer: Answer) {
    if (selectedAnswers[questionIndex]) {
      return;
    }

    const nextSelectedAnswers = [...selectedAnswers];
    nextSelectedAnswers[questionIndex] = answer;
    setSelectedAnswers(nextSelectedAnswers);

    const question = questions[questionIndex];
    const nextFeedbacks = [...feedbacks];

    if (answer.id === question.correctAnswer.id) {
      nextFeedbacks[questionIndex] = "Correct!";
      setScore((prev) => prev + 1);
    } else {
      const correctAnswer = question.answers.find(
        (quizAnswer) => quizAnswer.id === question.correctAnswer.id,
      );
      nextFeedbacks[questionIndex] = `Wrong! Correct answer: ${correctAnswer?.text}`;
    }

    setFeedbacks(nextFeedbacks);
  }

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
        <MenuScreen
          savedQuizTitle={savedQuizTitle}
          hasSavedQuestions={savedQuestions.length > 0}
          onStartMusicQuiz={handleStartMusicQuiz}
          onStartSavedQuiz={handleStartSavedQuiz}
          onCreateNewQuiz={() => {
            setImportMessage("");
            setScreen("import");
          }}
        />
      ) : screen === "import" ? (
        <CreateQuizScreen
          createMode={createMode}
          createdQuestions={createdQuestions}
          correctAnswerIndex={correctAnswerIndex}
          draftAnswers={draftAnswers}
          draftIncludesPianoHelper={draftIncludesPianoHelper}
          draftJsonQuiz={draftJsonQuiz}
          draftQuestion={draftQuestion}
          draftQuizTitle={draftQuizTitle}
          importMessage={importMessage}
          showsJsonHelp={showsJsonHelp}
          onAddQuestion={handleAddQuestion}
          onBack={() => setScreen("menu")}
          onDraftAnswerChange={handleDraftAnswerChange}
          onDraftIncludesPianoHelperChange={setDraftIncludesPianoHelper}
          onDraftJsonQuizChange={setDraftJsonQuiz}
          onDraftQuestionChange={setDraftQuestion}
          onDraftQuizTitleChange={setDraftQuizTitle}
          onSaveQuiz={handleSaveCreatedQuiz}
          onSetCorrectAnswerIndex={setCorrectAnswerIndex}
          onSetCreateMode={setCreateMode}
          onStartQuiz={() => {
            void handleStartCreatedQuiz();
          }}
          onToggleJsonHelp={() => setShowsJsonHelp((prev) => !prev)}
        />
      ) : (
        <QuizScreen
          title={activeQuizTitle}
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          currentAnswer={currentAnswer}
          feedback={feedbacks[currentQuestionIndex]}
          includesPianoHelper={includesPianoHelper}
          isLastQuestion={isLastQuestion}
          onAnswerClick={(answer) =>
            handleAnswerClick(currentQuestionIndex, answer)
          }
          onNextQuestion={handleNextQuestion}
          onFinishQuiz={() => setQuizFinished(true)}
        />
      )}
    </div>
  );
}

export default App;

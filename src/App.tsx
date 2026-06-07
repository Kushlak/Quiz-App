import { useEffect, useState } from "react";
import QuizSession from "./components/QuizSession";
import ThemeSwitcher, { ThemeName } from "./components/ThemeSwitcher";
import { quizData } from "./data/quizData";
import CreateQuizScreen from "./screens/CreateQuizScreen";
import MenuScreen from "./screens/MenuScreen";
import { QuizQuestion } from "./types";
import {
  ColorThemeVariant,
  getRandomColorThemeVariant,
  getSavedColorThemeVariant,
  getSavedTheme,
} from "./utils/themeStorage";

type AppScreen = "menu" | "import" | "quiz";

type QuizConfig = {
  title: string;
  questions: QuizQuestion[];
  includesPianoHelper: boolean;
};

const musicQuiz: QuizConfig = {
  title: "Music Theory Quiz",
  questions: quizData,
  includesPianoHelper: true,
};

function App() {
  const [theme, setTheme] = useState<ThemeName>(getSavedTheme);
  const [colorThemeVariant, setColorThemeVariant] =
    useState<ColorThemeVariant>(getSavedColorThemeVariant);
  const [screen, setScreen] = useState<AppScreen>("menu");
  const [activeQuiz, setActiveQuiz] = useState<QuizConfig>(musicQuiz);
  const [savedQuiz, setSavedQuiz] = useState<QuizConfig | null>(null);

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

  function handleStartQuiz(quiz: QuizConfig) {
    setActiveQuiz(quiz);
    setScreen("quiz");
  }

  function handleStartSavedQuiz() {
    if (savedQuiz === null) {
      return;
    }

    handleStartQuiz(savedQuiz);
  }

  function handleSaveQuiz(quiz: QuizConfig) {
    setSavedQuiz(quiz);
    setScreen("menu");
  }

  return (
    <div
      className={`app-shell theme-${theme} theme-color-${colorThemeVariant}`}
    >
      <ThemeSwitcher theme={theme} onThemeChange={handleThemeChange} />

      {screen === "menu" ? (
        <MenuScreen
          savedQuizTitle={savedQuiz?.title ?? ""}
          hasSavedQuestions={savedQuiz !== null}
          onStartMusicQuiz={() => handleStartQuiz(musicQuiz)}
          onStartSavedQuiz={handleStartSavedQuiz}
          onCreateNewQuiz={() => setScreen("import")}
        />
      ) : screen === "import" ? (
        <CreateQuizScreen
          onBack={() => setScreen("menu")}
          onSaveQuiz={handleSaveQuiz}
          onStartQuiz={(quiz) => {
            setSavedQuiz(quiz);
            handleStartQuiz(quiz);
          }}
        />
      ) : (
        <QuizSession
          title={activeQuiz.title}
          questions={activeQuiz.questions}
          includesPianoHelper={activeQuiz.includesPianoHelper}
          onMenu={() => setScreen("menu")}
        />
      )}
    </div>
  );
}

export default App;

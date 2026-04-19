import "./style.css";

type QuizQuestion = {
  question: string;
  answers: string[];
};

const quizData: QuizQuestion[] = [
  {
    question: "Which instrument has 88 keys?",
    answers: ["Piano", "Violin", "Flute", "Drums"],
  },
];

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");

if (!questionElement || !answersElement || !nextButton) {
  throw new Error("Quiz DOM elements are missing.");
}

let currentQuestionIndex = 0;

function renderQuestion(): void {
  const currentQuestion = quizData[currentQuestionIndex];

  questionElement.textContent = currentQuestion.question;
  answersElement.innerHTML = "";

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("answer-btn");
    answersElement.appendChild(button);
  });
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex = (currentQuestionIndex + 1) % quizData.length;
  renderQuestion();
});

renderQuestion();

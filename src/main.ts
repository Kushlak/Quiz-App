import "./style.css";

type QuizQuestion = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

const quizData: QuizQuestion[] = [
  {
    question: "Which instrument has 88 keys?",
    answers: ["Piano", "Violin", "Flute", "Drums"],
    correctAnswer: "Piano",
  },
  {
    question: "Which planet is called the Red Planet?",
    answers: ["Earth", "Mars", "Venus", "Jupiter"],
    correctAnswer: "Mars",
  },
];

const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answers");
const nextButton = document.getElementById("next-btn");
const feedbackElement = document.getElementById("feedback");
const scoreElement = document.getElementById("score");

if (
  !questionElement ||
  !answersElement ||
  !nextButton ||
  !feedbackElement ||
  !scoreElement
) {
  throw new Error("Quiz DOM elements are missing.");
}

let currentQuestionIndex = 0;
let score = 0;
let answered = false;

function renderQuestion(): void {
  const currentQuestion = quizData[currentQuestionIndex];

  questionElement.textContent = currentQuestion.question;
  answersElement.innerHTML = "";
  feedbackElement.textContent = "";
  answered = false;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.classList.add("answer-btn");

    button.addEventListener("click", () => {
      if (answered) return;

      answered = true;

      if (answer === currentQuestion.correctAnswer) {
        feedbackElement.textContent = "Correct!";
        score++;
        scoreElement.textContent = "Score: " + score;
      } else {
        feedbackElement.textContent =
          "Wrong! Correct answer: " + currentQuestion.correctAnswer;
      }
    });

    answersElement.appendChild(button);
  });
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;

  if (currentQuestionIndex >= quizData.length) {
    questionElement.textContent = "Quiz finished!";
    answersElement.innerHTML = "";
    feedbackElement.textContent = "Your final score is: " + score;
    nextButton.style.display = "none";
    return;
  }

  renderQuestion();
});

renderQuestion();
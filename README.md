# Quiz App

This project is a small React + TypeScript quiz application. It shows a music theory quiz, lets the user select one answer for each question, gives immediate feedback, and then displays the final score.

The main task in this version is to split the quiz UI into reusable components and pass data through props.

## Project Structure

```text
quiz-app/
├── index.html
├── package.json
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── style.css
│   ├── types.ts
│   ├── vite-env.d.ts
│   └── components/
│       ├── AnswerButtons.tsx
│       ├── FinishQuiz.tsx
│       ├── NextQuestionButton.tsx
│       ├── QuizCard.tsx
│       ├── QuizContainer.tsx
│       └── QuizProgress.tsx
```

## Application Flow

1. `index.html` provides a `<div id="root"></div>` element.
2. `src/main.tsx` mounts the React app into that root element.
3. `src/App.tsx` stores the quiz data and controls the quiz state.
4. `App` renders reusable components and passes data to them through props.
5. The user clicks an answer button.
6. `App` checks whether the answer is correct, updates score and feedback, and prevents answering the same question twice.
7. When all questions are answered, the Finish Quiz button becomes usable.
8. The final screen shows the score and allows the user to retry the quiz.

## Core Types

File: `src/types.ts`

### `Answer`

```ts
export type Answer = {
  id: number;
  text: string;
};
```

This type represents one possible answer.

- `id` identifies the answer.
- `text` is the label shown on the answer button.

### `QuizQuestion`

```ts
export type QuizQuestion = {
  question: string;
  answers: Answer[];
  correctAnswer: {
    id: number;
  };
};
```

This type represents one full quiz question.

- `question` is the question text.
- `answers` is the list of possible answers.
- `correctAnswer.id` stores the ID of the correct answer.

The app compares the selected answer ID with `correctAnswer.id` to decide whether the answer is correct.

## Entry Point

File: `src/main.tsx`

```tsx
createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

This file starts the React app.

- `createRoot(...)` tells React where to render the app.
- `document.getElementById("root")` finds the root element from `index.html`.
- `<App />` is the main application component.
- `<React.StrictMode>` helps detect potential problems during development.

## Main App Logic

File: `src/App.tsx`

`App` is the main stateful component. It owns the quiz data and all important state.

### Quiz Data

```ts
const quizData: QuizQuestion[] = [...]
```

`quizData` is an array of quiz questions. Each question has:

- a question string,
- a list of answer objects,
- the ID of the correct answer.

This data is passed down into child components instead of being hardcoded inside those components.

### State

```ts
const [score, setScore] = useState(0);
```

Stores how many correct answers the user selected.

```ts
const [selectedAnswers, setSelectedAnswers] = useState<(Answer | null)[]>(
  quizData.map(() => null),
);
```

Stores the selected answer for each question.

- At the start, every question has `null` because no answer has been selected.
- After the user clicks an answer, that answer object is stored at the matching question index.

```ts
const [feedbacks, setFeedbacks] = useState<string[]>(quizData.map(() => ""));
```

Stores feedback text for each question.

- Correct answers show `"Correct!"`.
- Wrong answers show the correct answer text.

```ts
const [quizFinished, setQuizFinished] = useState(false);
```

Controls whether the app shows the active quiz screen or the final result screen.

### `handleAnswerClick`

```ts
function handleAnswerClick(questionIndex: number, answer: Answer) {
  if (selectedAnswers[questionIndex]) {
    return;
  }

  const nextSelectedAnswers = [...selectedAnswers];
  nextSelectedAnswers[questionIndex] = answer;
  setSelectedAnswers(nextSelectedAnswers);

  const question = quizData[questionIndex];

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
```

This function runs when the user clicks an answer.

Logic:

1. It receives the question index and clicked answer.
2. It checks if that question already has an answer.
3. If the question was already answered, it stops with `return`.
4. It copies the `selectedAnswers` array.
5. It stores the clicked answer at the matching index.
6. It compares the clicked answer ID with the correct answer ID.
7. If correct, it sets feedback to `"Correct!"` and increments the score.
8. If wrong, it finds the correct answer text and stores it in the feedback.

The arrays are copied with spread syntax because React state should be treated as immutable. Instead of changing the old array directly, the app creates a new array and passes it to the setter.

### `handleFinishQuiz`

```ts
function handleFinishQuiz() {
  if (!selectedAnswers.every((answer) => answer !== null)) {
    return;
  }

  setQuizFinished(true);
}
```

This function finishes the quiz only if all questions have an answer.

- `every(...)` checks every item in `selectedAnswers`.
- If at least one answer is still `null`, the function stops.
- If all questions are answered, `quizFinished` becomes `true`.

### `handleRetryQuiz`

```ts
function handleRetryQuiz() {
  setScore(0);
  setSelectedAnswers(quizData.map(() => null));
  setFeedbacks(quizData.map(() => ""));
  setQuizFinished(false);
}
```

This resets the app back to the initial quiz state.

It clears:

- score,
- selected answers,
- feedback messages,
- final screen state.

### `allAnswered`

```ts
const allAnswered = selectedAnswers.every((answer) => answer !== null);
```

This value is used to decide whether the Finish Quiz button should be enabled.

If all questions are answered, `allAnswered` is `true`. Otherwise it is `false`.

## Components

## `QuizContainer`

File: `src/components/QuizContainer.tsx`

```tsx
type Props = {
  title: string;
  children: ReactNode;
};
```

`QuizContainer` is a reusable layout wrapper.

Props:

- `title`: text displayed as the main heading.
- `children`: any content placed inside the container.

Render logic:

```tsx
return (
  <div className="quiz-container">
    <h1 className="quiz-title">{title}</h1>
    {children}
  </div>
);
```

This component does not know anything about quiz questions, answers, or score. It only provides the shared outer layout.

Used by:

- `App`, for the active quiz screen.
- `FinishQuiz`, for the final result screen.

## `QuizCard`

File: `src/components/QuizCard.tsx`

`QuizCard` is a reusable card component. It supports two use cases:

1. Rendering a full quiz question.
2. Wrapping custom child content.

Props:

```tsx
type Props = {
  children?: ReactNode;
  current?: number;
  total?: number;
  question?: string;
  answers?: Answer[];
  onAnswerClick?: (answer: Answer) => void;
  feedback?: string;
};
```

Quiz question props:

- `current`: current question number.
- `total`: total number of questions.
- `question`: question text.
- `answers`: answer list.
- `onAnswerClick`: function called when an answer is selected.
- `feedback`: feedback text for this question.

Generic wrapper prop:

- `children`: custom content to display inside the card.

Main logic:

```tsx
const canRenderQuizParts =
  current !== undefined &&
  total !== undefined &&
  question !== undefined &&
  answers !== undefined &&
  onAnswerClick !== undefined &&
  feedback !== undefined;
```

This checks whether all quiz-specific props were provided.

If yes, it renders a full question card:

```tsx
<div className="quiz-card">
  <QuizProgress current={current} total={total} />
  <h2 className="question">{question}</h2>
  <AnswerButtons answers={answers} onAnswerClick={onAnswerClick} />
  <p className="feedback">{feedback}</p>
</div>
```

If not, it renders only the custom children:

```tsx
return <div className="quiz-card">{children}</div>;
```

This is why `FinishQuiz` can reuse `QuizCard` for the final score screen.

## `QuizProgress`

File: `src/components/QuizProgress.tsx`

```tsx
type Props = {
  current: number;
  total: number;
};
```

`QuizProgress` displays which question the user is currently looking at.

Props:

- `current`: current question number.
- `total`: total number of questions.

Render output:

```tsx
<p className="progress">
  Question {current} of {total}
</p>
```

This component is simple and reusable because it does not calculate progress itself. It only displays the values passed through props.

## `AnswerButtons`

File: `src/components/AnswerButtons.tsx`

```tsx
type Props = {
  answers: Answer[];
  onAnswerClick: (answer: Answer) => void;
};
```

`AnswerButtons` renders one button for each answer.

Props:

- `answers`: array of answer objects.
- `onAnswerClick`: function received from the parent.

Render logic:

```tsx
{answers.map((answer) => (
  <button
    key={answer.id}
    className="answer-btn"
    onClick={() => onAnswerClick(answer)}
  >
    {answer.text}
  </button>
))}
```

Important details:

- `.map(...)` turns every answer object into a button.
- `key={answer.id}` gives React a stable identity for each button.
- `onClick={() => onAnswerClick(answer)}` sends the selected answer back to the parent.

This component does not check correctness. It only renders buttons and reports which answer was clicked.

## `NextQuestionButton`

File: `src/components/NextQuestionButton.tsx`

```tsx
type Props = {
  onClick: () => void;
  disabled: boolean;
  text?: string;
};
```

Despite the name, this component currently works as the final action button.

Props:

- `onClick`: function called when the button is clicked.
- `disabled`: controls whether the button is usable.
- `text`: optional button label.

Render output:

```tsx
<button className="next-btn" onClick={onClick} disabled={disabled}>
  {text || "Next Question"}
</button>
```

In `App`, it is used like this:

```tsx
<NextQuestionButton
  onClick={handleFinishQuiz}
  disabled={!allAnswered}
  text="Finish Quiz"
/>
```

That means:

- clicking the button calls `handleFinishQuiz`,
- the button is disabled until all questions are answered,
- the visible text is `"Finish Quiz"`.

## `FinishQuiz`

File: `src/components/FinishQuiz.tsx`

```tsx
type Props = {
  score: number;
  totalQuestions: number;
  onRetry: () => void;
};
```

`FinishQuiz` renders the final result screen.

Props:

- `score`: number of correct answers.
- `totalQuestions`: total number of quiz questions.
- `onRetry`: function that resets the quiz.

Render logic:

```tsx
<QuizContainer title="Music Theory Quiz">
  <QuizCard>
    <h2>Quiz finished!</h2>
    <p className="final-score">
      Your score: {score} / {totalQuestions}
    </p>
    <button className="next-btn" onClick={onRetry}>
      Try Again
    </button>
  </QuizCard>
</QuizContainer>
```

This component reuses:

- `QuizContainer` for the page layout,
- `QuizCard` for the white card styling.

It does not reset the quiz itself. It only calls the `onRetry` function passed from `App`.

## Prop Flow

The main prop flow starts in `App`.

```text
App
├── QuizContainer
│   └── QuizCard
│       ├── QuizProgress
│       └── AnswerButtons
├── NextQuestionButton
└── FinishQuiz
    └── QuizContainer
        └── QuizCard
```

Examples:

- `App` passes `question.question` to `QuizCard`.
- `QuizCard` passes `answers` to `AnswerButtons`.
- `AnswerButtons` sends the clicked answer back up through `onAnswerClick`.
- `App` updates state after receiving that answer.
- `App` passes `score` and `totalQuestions` to `FinishQuiz`.
- `FinishQuiz` calls `onRetry`, which runs `handleRetryQuiz` in `App`.

This is a normal React pattern:

- state lives in the parent,
- child components receive data through props,
- child components notify the parent through callback props.

## Styling

File: `src/style.css`

The CSS defines the visual layout of the quiz.

Important classes:

- `.quiz-container`: centers the quiz and limits its width.
- `.quiz-title`: centers the page title.
- `.quiz-card`: creates the white bordered card.
- `.quiz-list`: stacks multiple question cards with spacing.
- `.progress`: styles the question progress text.
- `.answers`: stacks answer buttons.
- `.answer-btn`: styles each answer button.
- `.feedback`: reserves space for feedback text.
- `.next-btn`: styles the Finish Quiz and Try Again buttons.
- `.final-score`: makes the final score text larger.

## Why This Satisfies the Component Task

The task was:

> Create reusable quiz components and pass data through props.

This is done because:

- quiz layout is extracted into `QuizContainer`,
- question display is extracted into `QuizCard`,
- answer rendering is extracted into `AnswerButtons`,
- progress display is extracted into `QuizProgress`,
- the action button is extracted into `NextQuestionButton`,
- the final screen is extracted into `FinishQuiz`,
- `App` passes quiz data, state values, and event handlers through props.

The components do not own the main quiz state. They receive what they need from `App`, render UI, and call callback props when the user interacts with them.

## Run Commands

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Type-check:

```bash
npx tsc --noEmit
```

Build:

```bash
npm run build
```

On this machine, PowerShell may block `npm.ps1`. If that happens, use:

```bash
npm.cmd run build
```


import { useState } from "react";
import { musicFunFacts } from "../data/musicFunFacts";

function getRandomFact(facts: string[]) {
  const randomIndex = Math.floor(Math.random() * facts.length);

  return facts[randomIndex];
}

function MusicFunFact() {
  const [currentFact, setCurrentFact] = useState("");

  function handleNewFactClick() {
    setCurrentFact(getRandomFact(musicFunFacts));
  }

  return (
    <section className="note-of-day">
      <h2>Music Fun Fact:</h2>
      {!!currentFact && <p>{currentFact}</p>}
      <button
        className="fact-button"
        type="button"
        onClick={handleNewFactClick}
      >
        {currentFact ? "Show Another Fact" : "Show Fun Fact"}
      </button>
    </section>
  );
}

export default MusicFunFact;

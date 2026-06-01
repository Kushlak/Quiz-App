import { useState } from "react";
import c4Sound from "../../piano-mp3/C4.mp3";
import db4Sound from "../../piano-mp3/Db4.mp3";
import d4Sound from "../../piano-mp3/D4.mp3";
import eb4Sound from "../../piano-mp3/Eb4.mp3";
import e4Sound from "../../piano-mp3/E4.mp3";
import f4Sound from "../../piano-mp3/F4.mp3";
import gb4Sound from "../../piano-mp3/Gb4.mp3";
import g4Sound from "../../piano-mp3/G4.mp3";
import ab4Sound from "../../piano-mp3/Ab4.mp3";
import a4Sound from "../../piano-mp3/A4.mp3";
import bb4Sound from "../../piano-mp3/Bb4.mp3";
import b4Sound from "../../piano-mp3/B4.mp3";
import c5Sound from "../../piano-mp3/C5.mp3";

const notes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
  "High C",
];

const noteSounds: Record<string, string> = {
  C: c4Sound,
  "C#": db4Sound,
  D: d4Sound,
  "D#": eb4Sound,
  E: e4Sound,
  F: f4Sound,
  "F#": gb4Sound,
  G: g4Sound,
  "G#": ab4Sound,
  A: a4Sound,
  "A#": bb4Sound,
  B: b4Sound,
  "High C": c5Sound,
};



function getNoteExplanation(note: string) {
  if (note.includes("#")) {
    return `${note} is a sharp note. A sharp raises a note by one semitone.`;
  }

  return `${note} is a natural note. Natural notes do not use a sharp or flat symbol.`;
}

function playNote(note: string) {
  const audio = new Audio(noteSounds[note]);
  audio.currentTime = 0;
  audio.play();
}

// Interactive helper for quickly checking notes while taking the quiz.
function MiniPianoHelper() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  function handleNoteClick(note: string) {
    setSelectedNote(note);
    playNote(note);
  }

  return (
    <section className="piano-helper">
      <button
        className="helper-toggle"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "Hide Piano Helper" : "Show Piano Helper"}
      </button>

      {isOpen && (
        <div className="piano-panel">
          <div className="piano-keys" aria-label="Mini piano helper">
            {notes.map((note) => {
              const isSharp = note.includes("#");
              const isSelected = selectedNote === note;

              return (
                <button
                  key={note}
                  className={`piano-key${isSharp ? " sharp-key" : ""}${isSelected ? " selected-key" : ""}`}
                  type="button"
                  onClick={() => handleNoteClick(note)}
                >
                  {note}
                </button>
              );
            })}
          </div>

          {!!selectedNote && (
            <div className="note-info" aria-live="polite">
              <p>Selected note: {selectedNote}</p>
              <p>{getNoteExplanation(selectedNote)}</p>
            </div>
          )}

          <button
            className="helper-hide"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Hide Piano Helper
          </button>
        </div>
      )}
    </section>
  );
}

export default MiniPianoHelper;

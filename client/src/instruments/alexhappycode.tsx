// 3rd party library imports
import * as Tone from "tone";
import classNames from "classnames";
import { List } from "immutable";

// project imports
import { Instrument } from "../Instruments";

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Flute.
 ** ------------------------------------------------------------------------ */

interface FluteKeyProps {
  note?: string; // C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B
  duration?: string;
  synth?: Tone.Synth; // Contains library code for making sound
  octave?: number;
  index: number;
  sampler: Tone.Sampler;
  image: string;
}

export function FluteKey({
  note,
  index,
  sampler,
  image,
}: FluteKeyProps): JSX.Element {
  /**
   * This React component corresponds to either a major or minor key in the piano.
   * See `FluteKeyWithoutJSX` for the React component without JSX.
   */

  console.log('note', note)

  return (
    <div
      //onMouseDown={() => sampler.triggerAttack(`${note}`)} // Question: what is `onMouseDown`?
      onMouseDown={() => sampler.triggerAttackRelease(`${note}`, 1)} // Question: what is `onMouseDown`?
      onMouseUp={() => sampler.triggerRelease("+0.25")} // Question: what is `onMouseUp`?
      className={classNames("pointer absolute dim black bg-white")}
      style={{
        top: 0,
        left: `${index * 4}rem`,
        width: "5.0rem",
        height: `${30 - 1.5 * index}rem`,
        marginLeft: "0.25rem",
      }}
    >
      {note}
      <img
        alt=""
        src={image}
        style={{
          width: "100%",
          height: "100%",
        }}
      ></img>
    </div>
  );
}

function Flute(): JSX.Element {
  const sampler = new Tone.Sampler({
    urls: {
      C4: "flute/wav/Flute-C4.wav",
      D4: "flute/wav/Flute-D4.wav",
      E4: "flute/wav/Flute-E4.wav",
      F4: "flute/wav/Flute-F4.wav",
      G4: "flute/wav/Flute-G4.wav",
      A4: "flute/wav/Flute-A4.wav",
      B4: "flute/wav/Flute-B4.wav",
      C5: "flute/wav/Flute-C5.wav",
      D5: "flute/wav/Flute-D5.wav",
      E5: "flute/wav/Flute-E5.wav",
      F5: "flute/wav/Flute-F5.wav",
      G5: "flute/wav/Flute-G5.wav",
      A5: "flute/wav/Flute-A5.wav",
      B5: "flute/wav/Flute-B5.wav",
      C6: "flute/wav/Flute-C6.wav",
    },
    baseUrl: "./",
    onload: () => {
      //sampler.triggerAttackRelease(["C1", "E1", "G1", "B1"], 0.5);
      //sampler.triggerAttackRelease(["A4", "B4", "C4", "D4"], 0.5);
    },
  }).toDestination();

  // list is only being used to loop through the notes currently not using the player
  const notes = List([
    { note: "C4" },
    { note: "D4" },
    { note: "E4" },
    { note: "F4" },
    { note: "G4" },
    { note: "A4" },
    { note: "B4" },
    // below is new
    { note: "C5" },
    { note: "D5" },
    { note: "E5" },
    { note: "F5" },
    { note: "G5" },
    { note: "A5" },
    { note: "B5" },
    { note: "C6" },
  ]);

  return (
    <div className="pv4">
      <div className="relative dib h4 w-100 ma6">
        {notes.map((note, idx) => {
          let imagePath;
          if (idx > 6) imagePath = "flute/images/" + 6 + ".png";
          else imagePath = "flute/images/" + idx + ".png";
          return (
            <>
              <FluteKey
                image={imagePath}
                index={idx}
                note={note.note}
                sampler={sampler}
              />
            </>
          );
        })}
      </div>
    </div>
  );
}

export const FluteInstrument = new Instrument("Flute", Flute);

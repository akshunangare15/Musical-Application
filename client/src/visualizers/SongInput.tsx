// 3rd party library imports
import * as Tone from "tone";
import classNames from "classnames";
import { List, Range } from "immutable";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DispatchAction } from "../Reducer";
import { Instrument, InstrumentProps } from "../Instruments";
import { Autocomplete } from "@mui/material";
import { send } from '../Socket';

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for SongInput.
 ** ------------------------------------------------------------------------ */

interface SongInputKeyProps {
  note: string; // C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B
  duration?: string;
  synth?: Tone.Synth; // Contains library code for making sound
  minor?: boolean; // True if minor key, false if major key
  octave: number;
  index: number; // octave + index together give a location for the SongInput key
  addKey: (note: string) => void;
}

function SongInputKey({
  note,
  synth,
  minor,
  index,
  addKey,
}: SongInputKeyProps): JSX.Element {
  return (
    <div
      onMouseDown={() => {
        synth?.triggerAttackRelease(`${note}`, "8n");
        addKey(`${note}`);
      }}
      className={classNames("ba pointer absolute dim", {
        "bg-black black h3": minor,
        "black bg-white h4": !minor,
      })}
      style={{
        // CSS
        top: 0,
        left: `${index * 2}rem`,
        zIndex: minor ? 1 : 0,
        width: minor ? "1.5rem" : "2rem",
        marginLeft: minor ? "0.25rem" : 0,
      }}
    ></div>
  );
}

function SongInput({
  synth,
  setSynth,
  state,
  dispatch,
}: InstrumentProps): JSX.Element {
  let [songName, setSongName] = useState("");
  let [artistName, setArtistName] = useState("");

  let [notes, setNotes] = React.useState([] as string[]);

  const addKey = (note: string) => {
    setNotes(notes.concat([note]));
  };

  const deleteNote = () => {
    notes.pop();
    setNotes(notes.slice(0, notes.length));
  };

  const resetNotes = () => {
    setNotes([]);
  };

  function createSong() {
    let inputNotes = "";
    notes.forEach((note) => (inputNotes += `${note} `));
    inputNotes = inputNotes.trim();

    console.log(songName, artistName, notes);

    if (
      !(
        artists.indexOf(artistName) < 0 ||
        songName.length === 0 ||
        notes.length === 0
      )
    ) {
      dispatch(
        new DispatchAction("ADD_SONG", {
          artistName: artistName,
          songTitle: songName,
          notes: inputNotes,
          coverArt: null,
        })
      );
      const update = async () => {
        const allSongs = await send(state.get("socket"), "get_songs", {});
        dispatch(new DispatchAction("SHOW_ALL_SONGS", { allSongs }));
      }

      update()
    }

    setSongName("");
    setArtistName("");
    setNotes([]);
  }

  let artists: string[] = [];
  let artistMap: List<any> = state
    .get("artists", List())
    .forEach((artistItem: any) => artists.push(artistItem.get("artistName")));

  const inputDivStyle: React.CSSProperties = {
    position: "relative",
    top: "90%",
    left: "0%",
  };

  const keys = List([
    { note: "C", idx: 0 },
    { note: "Db", idx: 0.5 },
    { note: "D", idx: 1 },
    { note: "Eb", idx: 1.5 },
    { note: "E", idx: 2 },
    { note: "F", idx: 3 },
    { note: "Gb", idx: 3.5 },
    { note: "G", idx: 4 },
    { note: "Ab", idx: 4.5 },
    { note: "A", idx: 5 },
    { note: "Bb", idx: 5.5 },
    { note: "B", idx: 6 },
  ]);

  return (
    <div className="pv4">
      <div className="relative dib h4 w-100 ml4">
        <div>
          {Range(2, 7).map((octave) =>
            keys.map((key) => {
              const isMinor = key.note.indexOf("b") !== -1;
              const note = `${key.note}${octave}`;
              return (
                <SongInputKey
                  key={note}
                  note={note}
                  synth={synth}
                  minor={isMinor}
                  octave={octave}
                  index={(octave - 2) * 7 + key.idx}
                  addKey={() => addKey(note)}
                />
              );
            })
          )}
        </div>
        <div className="song-input-form-div" style={inputDivStyle}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Autocomplete
              id="artist-input-form"
              onInputChange={(e, value) => {
                setArtistName(value);
              }}
              inputValue = {artistName}
              disablePortal
              options={artists}
              sx={{ width: 150 }}
              renderInput={(params) => (
                <TextField
                  required
                  style={{}}
                  {...params}
                  label="Artist"
                />
              )}
            />
            <TextField
              id="song-name-input-form"
              className=""
              margin="normal"
              label="Song Title"
              variant="outlined"
              value={songName}
              onChange={(e) => setSongName(e.currentTarget.value)}
              required
            />
            <TextField
              id="song-input-form"
              multiline
              className=""
              margin="normal"
              label="Song"
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
              value={notes}
              onChange={(e) => setNotes(notes)}
              required
            />
          </div>
          <div>
            <Button onClick={createSong} variant="outlined">
              Submit
            </Button>
            <Button onClick={deleteNote}>Delete Note</Button>
            <Button
              onClick={resetNotes}
              type="button"
              className="btn btn-primary"
            >
              Reset Notes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const SongInputInstrument = new Instrument("SongInput", SongInput);

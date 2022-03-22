// 3rd party library imports
import * as Tone from "tone";
import classNames from "classnames";
import { List, Range } from "immutable";
import React, { useState } from "react";
import { HighContrast } from "react-dial-knob";
import { Switch, FormControlLabel } from "@mui/material";
import "./WerkstattStylesheet.css";

// project imports
import { Instrument, InstrumentProps } from "../Instruments";

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Werkstatt.
 ** ------------------------------------------------------------------------ */

interface WerkstattKeyProps {
  note: string; // C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B
  duration?: string;
  synth?: Tone.Synth; // Contains library code for making sound
  minor?: boolean; // True if minor key, false if major key
  octave: number;
  index: number; // octave + index together give a location for the piano key
}

export function WerkstattKey({
  note,
  synth,
  minor,
  index,
}: WerkstattKeyProps): JSX.Element {
  /**
   * This React component corresponds to either a major or minor key in the Werkstatt.
   * See `WerkstattKeyWithoutJSX` for the React component without JSX.
   */

  return (
    // Observations:
    // 1. The JSX refers to the HTML-looking syntax within TypeScript.
    // 2. The JSX will be **transpiled** into the corresponding `React.createElement` library call.
    // 3. The curly braces `{` and `}` should remind you of string interpolation.

    <div
      onMouseDown={() => {
        synth?.triggerAttackRelease(`${note}`, Tone.now());
      }}
      onMouseUp={() => {
        if (!vca) {
          synth?.triggerRelease();
        }
      }}
      className={classNames("ba pointer absolute dim", {
        "bg-black black h3": minor, // minor keys are black
        "black bg-white h4": !minor, // major keys are white
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

var filter = new Tone.Filter(1, "lowpass");
var filterApplied = false;
var vca = false;
var set = false;
const lfo = new Tone.LFO({
  type: "square",
  frequency: 2,
  min: 0,
  max: 1000,
});

function Werkstatt({ synth, setSynth }: InstrumentProps): JSX.Element {
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

  if (!set) {
    synth.set({volume: -10})
    lfo.fan(synth.detune).start();
    synth.set({
      envelope: { sustain: 1 },
    });
    set = true;
  }

  function LFOWaveSwitch() {
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      if (checked) {
        lfo.set({
          type: "triangle",
        });
      } else {
        lfo.set({
          type: "square",
        });
      }
    };

    return (
      <FormControlLabel
        value="bottom"
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        label="WAVE"
        labelPlacement="bottom"
      />
    );
  }

  function VCOAmountKnob() {
    const [value, setValue] = useState(0);

    return (
      <HighContrast
        diameter={50}
        min={0}
        max={100}
        step={1}
        value={value}
        theme={{
          defaultColor: "black",
          activeColor: "red",
        }}
        onValueChange={(value) => {
          lfo.set({
            amplitude: value / 100,
          });
          setValue(value);
        }}
        ariaLabelledBy={"my-label"}
      >
        <label id={"my-label"}>AMOUNT</label>
      </HighContrast>
    );
  }

  function LFORateKnob() {
    const [value, setValue] = useState(0);

    return (
      <HighContrast
        diameter={50}
        min={2}
        max={600}
        step={1}
        value={value}
        theme={{
          defaultColor: "black",
          activeColor: "red",
        }}
        onValueChange={(value) => {
          lfo.set({
            frequency: value / 10,
          });
          setValue(value);
        }}
        ariaLabelledBy={"my-label"}
      >
        <label id={"my-label"}>LFO RATE</label>
      </HighContrast>
    );
  }

  function WaveSwitch() {
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      if (checked) {
        synth.set({
          oscillator: { type: "pulse" },
        });
      } else {
        synth.set({
          oscillator: { type: "sawtooth" },
        });
      }
    };

    return (
      <FormControlLabel
        value="bottom"
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        label="WAVE"
        labelPlacement="bottom"
      />
    );
  }

  function AttackKnob() {
    const [value, setValue] = useState(0);

    return (
      <HighContrast
        diameter={50}
        min={0}
        max={100}
        step={1}
        value={value}
        theme={{
          defaultColor: "black",
          activeColor: "red",
        }}
        onValueChange={(value) => {
          synth.set({
            envelope: {
              attack: value / 50,
            },
          });
          setValue(value);
        }}
        ariaLabelledBy={"my-label"}
      >
        <label id={"my-label"}>ATTACK</label>
      </HighContrast>
    );
  }

  function DecayKnob() {
    const [value, setValue] = useState(0);

    return (
      <HighContrast
        diameter={50}
        min={0}
        max={100}
        step={1}
        value={value}
        theme={{
          defaultColor: "black",
          activeColor: "red",
        }}
        onValueChange={(value) => {
          synth.set({
            envelope: {
              decay: value / 100 + 0.01,
            },
          });
          setValue(value);
        }}
        ariaLabelledBy={"my-label"}
      >
        <label id={"my-label"}>DECAY</label>
      </HighContrast>
    );
  }

  function FrequencyKnob() {
    const [value, setValue] = useState(0);

    return (
      <HighContrast
        diameter={50}
        min={0}
        max={100}
        step={1}
        value={value}
        theme={{
          defaultColor: "black",
          activeColor: "red",
        }}
        onValueChange={(value) => {
          synth.set({
            detune: value * 12,
          });
          setValue(value);
        }}
        ariaLabelledBy={"my-label"}
      >
        <label id={"my-label"}>FREQ</label>
      </HighContrast>
    );
  }

  function PWMKnob() {
    const [value, setValue] = useState(0);

    return (
      <HighContrast
        diameter={50}
        min={0}
        max={100}
        step={1}
        value={value}
        theme={{
          defaultColor: "black",
          activeColor: "red",
        }}
        onValueChange={(value) => {
          setValue(value);
          synth.set({
            oscillator: {
              width: value / 100,
            },
          });
        }}
        ariaLabelledBy={"my-label"}
      >
        <label id={"my-label"}>PWM</label>
      </HighContrast>
    );
  }

  function GlideKnob() {
    const [value, setValue] = useState(0);

    return (
      <HighContrast
        diameter={50}
        min={0}
        max={100}
        step={1}
        value={value}
        theme={{
          defaultColor: "black",
          activeColor: "red",
        }}
        onValueChange={(value) => {
          setValue(value);
          synth.set({
            portamento: value / 50,
          });
        }}
        ariaLabelledBy={"my-label"}
      >
        <label id={"my-label"}>GLIDE</label>
      </HighContrast>
    );
  }

  function SustainSwitch() {
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      if (!checked) {
        synth.set({
          envelope: {
            sustain: 1,
          },
        });
      } else {
        synth.set({
          envelope: {
            sustain: 0,
          },
        });
      }
    };

    return (
      <FormControlLabel
        value="bottom"
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        label="SUSTAIN"
        labelPlacement="bottom"
      />
    );
  }

  function VCASwitch() {
    const [checked, setChecked] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      if (checked) {
        vca = false;
      } else {
        vca = true;
      }
    };

    return (
      <FormControlLabel
        value="bottom"
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          />
        }
        label="VCA"
        labelPlacement="bottom"
      />
    );
  }

  function CutoffKnob() {
    const [value, setValue] = useState(0);
    if (!filterApplied) {
      synth.chain(filter, Tone.Destination);
      filterApplied = true;
    }
    return (
      <HighContrast
        diameter={50}
        min={1}
        max={1000}
        step={1}
        value={value}
        theme={{
          defaultColor: "black",
          activeColor: "red",
        }}
        onValueChange={(value) => {
          setValue(value);
          filter.set({ frequency: value * 20 });
        }}
        ariaLabelledBy={"my-label"}
      >
        <label id={"my-label"}>Cutoff</label>
      </HighContrast>
    );
  }

  return (
    <div className="pv4">
      <script src="./pureknob.js"></script>
      <div id="glide">{GlideKnob()}</div>
      <div id="controls">
        <div id="vco" className="control-div">
          <label className="control-label">VCO</label>
          {FrequencyKnob()}
          {WaveSwitch()}
          {PWMKnob()}
        </div>
        <div id="vcf" className="control-div">
          <label className="control-label">VCF</label>

          {CutoffKnob()}
        </div>
        <div id="vca" className="control-div">
          <label className="control-label">VCA</label>
          {VCASwitch()}
        </div>
        <div id="vco-mod" className="control-div">
          <label className="control-label">VCO Mod</label>
          {VCOAmountKnob()}
        </div>
        <div id="vcf-mod" className="control-div">
          <label className="control-label">VCF Mod</label>
        </div>
        <div id="lfo" className="control-div">
          <label className="control-label">LFO</label>
          {LFORateKnob()}
          {LFOWaveSwitch()}
        </div>
        <div id="envelope" className="control-div">
          <label className="control-label">Envelope</label>
          {SustainSwitch()}
          {AttackKnob()}
          {DecayKnob()}
        </div>
      </div>
      <div className="relative dib h4 w-100 ml4">
        {Range(2, 4).map((octave) =>
          keys.map((key) => {
            const isMinor = key.note.indexOf("b") !== -1;
            const note = `${key.note}${octave}`;
            return (
              <WerkstattKey
                key={note} //react key
                note={note}
                synth={synth}
                minor={isMinor}
                octave={octave}
                index={(octave - 2) * 7 + key.idx}
              />
            );
          })
        )}
      </div>
      <div style={{ margin: 50 }}>
        <h1>Notes:</h1>
        <ul>
          <li>
            If sustain is off, make sure that either attack or decay has a value
            above 0. If not, you will only hear clicking noises.
          </li>
          <li>
            PWM (Pulse Width Modulation) <i>only</i> modifies the width of the
            pulse wave. This will have no effect on the sawtooth wave.
          </li>
          <li>
            Currently, VCA will only work as intended when SUSTAIN is switched
            on. This only partially makes sense...
          </li>
        </ul>
      </div>
    </div>
  );
}

export const WerkstattInstrument = new Instrument("Werkstatt", Werkstatt);
// export const WerkstattInstrument2 = new Instrument('Werkstatt2', Werkstatt);

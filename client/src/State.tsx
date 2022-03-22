// 3rd party
import { List, Map } from "immutable";

// project dependencies
import { PianoInstrument } from "./instruments/Piano";
import { DrumInstrument } from './instruments/akshunangare15_DrumPad';
import { CircleFormVisualizer } from './visualizers/akshunangare15_CircleForm';
import { WerkstattInstrument } from "./instruments/Werkstatt";
import { WaveformVisualizer } from "./visualizers/Waveform";
import { TunerVisualizer } from "./visualizers/Tuner";
import { SongInputInstrument } from "./instruments/SongInput";
import { FluteInstrument } from './instruments/alexhappycode';
import { alexhappycodeVisualizer } from './visualizers/alexhappycode';
import { XylophoneInstrument } from './instruments/Xylophone';
import { GuitarInstrument } from './instruments/Guitar';
import { PeakAmpVisualizer } from './visualizers/PeakAmpVisualizer';
import { BarformVisualizer } from './visualizers/Barform';
import { FFTVisualizer } from './visualizers/FFT';

/** ------------------------------------------------------------------------ **
 * The entire application state is stored in AppState.
 ** ------------------------------------------------------------------------ */

/**
 * Observation: pure map (compare and contrast with impure map)
 *
 * 'instrument': Instrument
 * 'visualizer': Visualizer
 */
export type AppState = Map<string, any>;


const instruments = List([
  PianoInstrument, 
  XylophoneInstrument, 
  GuitarInstrument, 
  FluteInstrument, 
  WerkstattInstrument,
  SongInputInstrument,
  DrumInstrument
 ]);

const visualizers = List([WaveformVisualizer, BarformVisualizer, alexhappycodeVisualizer, TunerVisualizer, CircleFormVisualizer, FFTVisualizer]);
export const defaultState: AppState = Map<string, any>({
  instruments,
  visualizers,
});

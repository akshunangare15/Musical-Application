
// 3rd party library imports
import * as Tone from 'tone';
import classNames from 'classnames';
import { List, Range } from 'immutable';
import React, { useState } from 'react';


// project imports
import { Instrument, InstrumentProps } from '../Instruments';
import { transform } from 'typescript';
import { inherits } from 'util';
import { Scale } from 'tone';

/** ------------------------------------------------------------------------ **
 * Contains implementation of components for Drum.
 ** ------------------------------------------------------------------------ */

interface DrumKeyProps {
  note: string; // C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B
  duration?: string;
  synth?: Tone.Synth; // Contains library code for making sound
  sampler?: Tone.Sampler
  octave: number;
  index: number; // octave + index together give a location for the Drum key
  
}

export function DrumKey({
  note,
  synth,
  index,
}: DrumKeyProps): JSX.Element { 
  

    const sampler = new Tone.Sampler({
    urls: {
     A2: "drum/wav/drum_cowbell.wav",
     B2: "drum/wav/drum_Crash_01.wav",
     C2: "drum/wav/drum_electronic_snare.wav",
     D2: "drum/wav/drum_hh_sample.wav",
     E2: "drum/wav/drum_rimshot.wav",
     A3: "drum/wav/drum_clap.wav",
     B3: "drum/wav/drum_bass.wav",
     E3: "drum/wav/drum_cm_sesame.wav",
     D3: "drum/wav/drum_lokik_rm.wav",
     C3: "drum/wav/drum_BONGO3.wav",
      
    
     
    
    },
    baseUrl: "./",
    onload: () => {
     
    },
  }).toDestination();
  
  return (
   
    <div
      onMouseDown={() => { 
        sampler?.triggerAttack(`${note}`)
        console.log (`${note}`)
        
      }
      
      }
      // Question: what is `onMouseDown`?
      
      onMouseUp={() => sampler?.triggerRelease('+0.15')} 
      // Question: what is `onMouseUp`?
      className={classNames('ba pointer dim purple red ', {
        
      })}
      style={{
        // CSS
        //marginRight: "15",
       // marginLeft: "6rem",
        //backgroundImage: "drumset.jpg",
        justifyContent: 'space-between',
        alignItems: '8',
        display: 'inline-Grid ',
        width: '20%',
        height : '23%',
        fontSize: 'inherits',
        padding: '9% ',
        backgroundImage: 'url(drumset.jpg)',
        color: 'lightorange',
        margin: 'auto',
        background: 'Gray',
        transform: 'scale(0.7)',
        border: '5px solid #FF670E',
        marginTop: '3px',
        flexDirection: 'column',
        borderRadius: '100%',
        gridTemplateColumns: '140px 140px 140px 140px',
        gridTemplateRows: '140px 140px 140px 140px',
        marginBottom: '2px',
        
        

      }}
    ></div>
  );
}

function DrumType({ title, onClick, active }: any): JSX.Element {
  return (
    <div
      onClick={onClick}
      className={classNames('ba pointer dim', {
        
      
      })}
     
    >
      {title}
   
    </div>
  );
}

function Drum({ synth, setSynth}: InstrumentProps): JSX.Element {
  const keys = List([
    { note: "A" },
    { note: "B" },
    { note: "C" },
    { note: "D" },
    { note: "E" },


  ]);
  const setOscillator = (newType: Tone.ToneOscillatorType) => {
    setSynth(oldSynth => {
      oldSynth.dispose();

      return new Tone.Synth({
        oscillator: { type: newType } as Tone.OmniOscillatorOptions,
      }).toDestination();
    });
  };
  
  

  const oscillators: List<OscillatorType> = List([
  ]) as List<OscillatorType>;

  return (
    <div className="pv2">
      <div className=" h2 w-50">
        {Range(2,4).map(octave =>
          keys.map(key => {
           
            const note = `${key.note}${octave}`;
            
            return (
              <DrumKey
                key={note} //react key
                note={note}
                synth={synth}
                //key={keys}
                //minor={isMinor}
                octave={octave}
                index={(octave + 2) }              />
            );
          }),
        )}
      </div>
      <div className={'pl2 pt4 flex'}>
        <div className={'Drumset.jpg'}></div>
        {oscillators.map(o => (
          <DrumType
           // key={0}
            title={o}
            onClick={() => setOscillator(o)}
            active={synth?.oscillator.type === o}
           
          />
        ))}
      </div>
    </div>
  );
}

export const DrumInstrument = new Instrument('akshunangare15_DrumPad', Drum);

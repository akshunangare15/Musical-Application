// 3rd party library imports
// import { OmniOscillatorOptions, ToneOscillatorType } from 'tone';
import * as Tone from 'tone'
import classNames from 'classnames'
import { List, Range } from 'immutable'
import React from 'react'

// project imports
import { Instrument, InstrumentProps } from '../Instruments'


interface IdiophoneProps {
    note: string
    octave: number
    synth?: Tone.Sampler
    index: number
}


const Idiophone = ({
    note,
    octave,
    synth,
    index
}: IdiophoneProps): JSX.Element => {

    const style: React.CSSProperties = {
        userSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        left: `${2 * index}rem`, 
        width: '1.5rem',
        height: `${100 - (1.4 * index)}%`,
        marginLeft: '.2rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    }

    const play = () => {
        // synth?.triggerAttack(note, '+0', 1)
        synth?.triggerAttackRelease(note, 0.5)
        // synth?.triggerRelease('+.5')
    }
    
    return (
        <div
            onMouseDown = { () => play() }
            className={classNames('ba pointer absolute dim', 'black bg-white h4')}
            style = {style}
        >
            {note}
        </div>

    )
}

// const XylophoneType = ({ title, onClick, active }: any): JSX.Element => {
//     return (
//       <div
//         onClick={onClick}
//         className={classNames('dim pointer ph2 pv1 ba mr2 br1 fw7 bw1', {
//           'b--black black': active,
//           'gray b--light-gray': !active,
//         })}
//       >
//         {title}
//       </div>
//     )
// }

const Xylophone = ({synth, setSynth}: InstrumentProps): JSX.Element => {

    const keys = [
        { note: 'C', idx: 0 },
        { note: 'D', idx: 1 },
        { note: 'E', idx: 2 },
        { note: 'F', idx: 3 },
        { note: 'G', idx: 4 },
        { note: 'A', idx: 5 },
        { note: 'B', idx: 6 }
    ]

    // const setOscillator = (newType: Tone.ToneOscillatorType) => {
    //     setSynth(oldSynth => {
    //         oldSynth.disconnect();

    //         return new Tone.MembraneSynth({
    //             oscillator: { type: newType } as Tone.OmniOscillatorOptions,
    //         }).toDestination()
    //       })
    // }

    const sampler = new Tone.Sampler({
        urls: {
            A3: 'Xylo-A3.wav',
            // B3: 'Xylo-B3.wav',
            // C3: 'Xylo-C3.wav',
            // D3: 'Xylo-D3.wav',
            // E3: 'Xylo-E3.wav',
            // A4: 'Xylo-A4.wav',
            // B4: 'Xylo-B4.wav',
            // C4: 'Xylo-C4.wav',
            // D4: 'Xylo-D4.wav',
            // E4: 'Xylo-E4.wav',
            // A5: 'Xylo-A5.wav',
            // B5: 'Xylo-B5.wav',
            // C5: 'Xylo-C5.wav',
            // D5: 'Xylo-D5.wav',
            // E5: 'Xylo-E5.wav',
            // A6: 'Xylo-A6.wav',
            // B6: 'Xylo-B6.wav',
            // C6: 'Xylo-C6.wav',
            // D6: 'Xylo-D6.wav',
            // E6: 'Xylo-E6.wav',
            // A7: 'Xylo-A7.wav',
            // B7: 'Xylo-B7.wav',
            // C7: 'Xylo-C7.wav',
            // D7: 'Xylo-D7.wav',
            // E7: 'Xylo-E7.wav',
            // A8: 'Xylo-A8.wav',
            // B8: 'Xylo-B8.wav',
            // C8: 'Xylo-C8.wav',
            // D8: 'Xylo-D8.wav',
            // E8: 'Xylo-E8.wav',
        },
    }).toDestination()

    // const oscillators: List<OscillatorType> = List([
    //     'sine',
    //     'sawtooth',
    //     'square',
    //     'triangle',
    //     'fmsine',
    //     'fmsawtooth',
    //     'fmtriangle',
    //     'amsine',
    //     'amsawtooth',
    //     'amtriangle',
    //   ]) as List<OscillatorType>

    return (
        <div className="pv4">
            <div className="relative dib h4 w-100 ml4"
                style = {{
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                {Range(1, 6).map(octave =>
                    keys.map(key => {
                        return (
                            <Idiophone
                                key = {`Xylophone-${key.note}-${octave}`}
                                note = {`${key.note}${octave}`}
                                octave = {octave}
                                index = {(octave - 1) * keys.length + key.idx}
                                synth = { sampler }
                            />
                        )
                    })
                )}
            </div>
            {/* <div className={'pl4 pt4 flex'}>
                {oscillators.map(o => (
                  <XylophoneType
                    key={ o }
                    title={ o }
                    onClick= { () => setOscillator(o) }
                    active= { synth?.oscillator.type === o }
                  />
                ))}
            </div> */}
        </div>
    )
}

export const XylophoneInstrument = new Instrument('@RamziA961-Xylo', Xylophone)
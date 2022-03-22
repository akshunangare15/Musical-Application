// 3rd party library imports
import * as Tone from 'tone'
import classNames from 'classnames'
import { List, Range } from 'immutable'
import React from 'react'

// project imports
import { Instrument, InstrumentProps } from '../Instruments'


interface GuitarProps {
    note: string
    synth?: Tone.Sampler
    guitarString: number
}

// interface GuitarGroupProps {
//     note: string
//     synth?: Tone.Sampler
//     index: number
//     guitarString: number
// }


const GuitarString = ({
    note,
    synth,
    guitarString
}: GuitarProps): JSX.Element => {

    // console.log(guitarString)
    const style: React.CSSProperties = {
        backgroundColor: 'white',
        height: `2px`
    }
    const play = () => {
        // synth?.triggerAttack(note, '+0', 1)
        synth?.triggerAttackRelease(note, 1)
    }
    
    return (
        <div style = {style} onMouseEnter = {play}>
            &nbsp;
        </div>
    )
}

const  FretBoard = (): JSX.Element => {

    const style : React.CSSProperties = {
        position: 'absolute',
        width: '100%',
        height: '100%'
    }

    return (
        <img style = {style} src = '/guitarfret.jpeg' alt = ''/>
    )
}

interface StringGroupProps {
    octave: number
    synth: Tone.Sampler
}

const StringGroup = ({
    octave,
    synth
} : StringGroupProps): JSX.Element => {

    const style : React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'space-evenly',
        height: '100%',
        zIndex: 1
    }

    const keys = [
        { note: 'C', idx: 0 },
        { note: 'D', idx: 1 },
        { note: 'E', idx: 2 },
        { note: 'F', idx: 3 },
        { note: 'G', idx: 4 },
        { note: 'A', idx: 5 },
        { note: 'B', idx: 6 }
    ]    

    return (
        <div id = {`String-Group-${octave}`} style = {style}>
            {keys.map(key => 
                <GuitarString
                    key = {`Guitar-${key.note}-${octave}`}
                    note = {`${key.note}${octave}`}
                    // index = {(octave - 3) * keys.length + key.idx}
                    synth = { synth }
                    guitarString = { key.idx }
                />
            )}
        </div>
    )
}

// const GuitarType = ({ title, onClick, active }: any): JSX.Element => {
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

const Guitar = ({synth, setSynth}: InstrumentProps): JSX.Element => {

    const sampler = new Tone.Sampler({
        urls: {
            G3: 'Guitar-Gm.mp3'
        }
    }).toDestination()


    return (
        <div className="pv4">
            <div className="relative dib h4 w-100 ml4"
                style = {{
                    display: 'flex',
                    alignItems: 'center',
                    width: '95%'
                }}
            >
                <FretBoard/>

                {Range(3, 8).map(octave =>
                    <StringGroup
                        key = {`Guitar-String-Group-${octave}`}
                        octave = {octave}
                        synth = {sampler}    
                    />    
                )}
            </div>
            {/* <div className={'pl4 pt4 flex'}>
                {oscillators.map(o => (
                  <GuitarType
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

export const GuitarInstrument = new Instrument('@RamziA961-Guitar', Guitar)
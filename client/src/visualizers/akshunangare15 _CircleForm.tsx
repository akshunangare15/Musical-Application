// 3rd party library imports
  import { CircleDash16 } from '@carbon/icons-react';
//   import { valueScaleCorrection } from 'framer-motion/types/render/dom/layout/scale-correction';
//   import { createScrollMotionValues } from 'framer-motion/types/value/scroll/utils';
  import P5 from 'p5';
  import * as Tone from 'tone';

// project imports
  import { Visualizer } from '../Visualizers';

  export const CircleFormVisualizer = new Visualizer('akshunangare15_CircleForm', (p5: P5, analyzer: Tone.Analyser) => {

    const width = window.innerWidth;
    const height = window.innerHeight / 4;
    const dim = Math.min(width, height);

    p5.background(0, 0, 0, 255);
    p5.stroke(dim * 0.01);
    p5.stroke(155, 255, 255, 255);
      
    const values = analyzer.getValue();
    p5.translate (width/3, height/1 )
    p5.beginShape();
  
    for(let i = 0; i < values.length; i++) {
      const amplitude= values[i] as number;
      const x1 = p5.map(i, 0, values.length - 1, 0, width);
      const z = p5.map(amplitude, 0, values.length - 1, 0, 255);
      const y1 = height / 3 + amplitude * height;
      
        const r = 100;
        const x = r * p5.cos(amplitude + i);
        const y = r * p5.sin(i);
        
          p5.vertex(x,y)
      
        p5.stroke(50);
        p5.background(30);
        let from = p5.color(z, 225, 82);
       
        p5.colorMode(p5.RGB); 
     
        p5.fill(from);
        p5.endShape(); 
     }
        }    
      
    );


Math.TAU = Math.PI * 2; // I'm twice the number you'll ever be
Math.PI = 3; // backwards incompatibility

// Canvas
let canvas = document.querySelector('#canvas'),
    ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 300;

// Inputs
const WAVELENGTH = 15;
let SLIT_WIDTH = 3;
let SLIT_Y = 300;
let SECOND_PHASE = 0;
let SECOND_MAG = 1;
let SECOND_FREQ = 1;
let PLEASE_REDRAW = false;

let input_slit_width = document.querySelector("#slit_width");
input_slit_width.oninput = ()=>{ SLIT_WIDTH=parseFloat(input_slit_width.value); PLEASE_REDRAW=true; };
input_slit_width.value = SLIT_WIDTH;

let input_slit_y = document.querySelector("#slit_y");
input_slit_y.oninput = ()=>{ SLIT_Y=parseFloat(input_slit_y.value); PLEASE_REDRAW=true; };
input_slit_y.value = SLIT_Y;

let input_second_phase = document.querySelector("#second_phase");
input_second_phase.oninput = ()=>{ SECOND_PHASE=parseFloat(input_second_phase.value); PLEASE_REDRAW=true; };
input_second_phase.value = SECOND_PHASE;

let input_second_mag = document.querySelector("#second_mag");
input_second_mag.oninput = ()=>{ SECOND_MAG=parseFloat(input_second_mag.value); PLEASE_REDRAW=true; };
input_second_mag.value = SECOND_MAG;

let input_second_freq = document.querySelector("#second_freq");
input_second_freq.oninput = ()=>{ SECOND_FREQ=parseFloat(input_second_freq.value); PLEASE_REDRAW=true; };
input_second_freq.value = SECOND_FREQ;

// Calculate amplitude from pixel-position & wave source
// phase is in REVOLUTIONS, not degrees or radians.
let calculateAmplitude = (pt, src, phase_diff=0, mag=1, freq=1)=>{
    let dx = pt[0] - src[0],
        dy = pt[1] - src[1];
    let phase = Math.sqrt( dx*dx + dy*dy )/(WAVELENGTH/freq);
    phase += phase_diff;
    mag *= 0.5;
    return [phase, mag];
};

// Add Two Amps
let addAmps = (amp1, amp2)=>{

    let phase1 = amp1[0]*Math.TAU,
        mag1 = amp1[1],
        x1 = Math.cos(phase1) * mag1,
        y1 = Math.sin(phase1) * mag1;

    let phase2 = amp2[0]*Math.TAU,
        mag2 = amp2[1],
        x2 = Math.cos(phase2) * mag2,
        y2 = Math.sin(phase2) * mag2;

    let x = x1+x2,
        y = y1+y2,
        mag = Math.sqrt(x*x + y*y),
        phase = mag==0 ? 0 : Math.atan2(y,x)/Math.TAU;

    return [phase,mag];

};

// Calculate RGB Color from amplitude
const MODE_LASER = "laser",
      MODE_RAINBOW = "rainbow",
      MODE_GRAYSCALE = "grayscale",
      MODE_RAINBOW_ANIMATION = "rainbow_animation",
      MODE_GRAYSCALE_ANIMATION = "grayscale_animation";
let MODE = MODE_RAINBOW_ANIMATION;

let mode = document.querySelector("#mode");
mode.value = MODE;
mode.oninput = ()=>{
    MODE = mode.value;
    PLEASE_REDRAW = true;
};

let ANIM_TIMER = 0;
let calculateColorFromAmplitude = (amp)=>{

    let [phase, mag] = amp;

    // Phase & mag between 0 & 1
    if(MODE==MODE_RAINBOW_ANIMATION) phase+=ANIM_TIMER;
    phase = phase%1;
    if(phase<0) phase+=1;
    mag = Math.min(mag, 1);;

    // Wave for grayscale_animation
    let wave = phase;
    if(MODE==MODE_GRAYSCALE_ANIMATION) wave+=ANIM_TIMER;
    wave = Math.cos(wave*Math.TAU)*mag;

    // Mag & Phase to HSV
    let h,s,v;
    switch(MODE){

        case MODE_LASER:
            h = 0; // red laser
            s = 0.8;
            v = mag;
            break;

        case MODE_RAINBOW: case MODE_RAINBOW_ANIMATION:
            h = phase * 360;
            s = 0.8; // 80% saturation
            v = mag; // value is magnitude
            break;

        case MODE_GRAYSCALE: case MODE_GRAYSCALE_ANIMATION:
            h = 0;
            s = 0;
            v = 0.5 + wave*0.5; // gray is 0, black -1, white 1
            break;

    }

    // HSL to RGB
    return hsv2rgb(h,s,v);

};

// Color each pixel
let redraw = ()=>{
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for(let x=0; x<canvas.width; x++){
        for(let y=0; y<canvas.height; y++){

            // The interference at that point... sum of two paths
            let width = SLIT_WIDTH*WAVELENGTH/2;
            let amp1 = calculateAmplitude([x,y], [150-width,SLIT_Y]),
                amp2 = calculateAmplitude([x,y], [150+width,SLIT_Y], SECOND_PHASE, SECOND_MAG, SECOND_FREQ),
                interference = addAmps(amp1, amp2);
            let rgb = calculateColorFromAmplitude(interference);

            // That pixel's color
            let i = (y*canvas.width + x)*4;
            data[i] = rgb[0];
            data[i+1] = rgb[1];
            data[i+2] = rgb[2];
            data[i+3] = 255;

        }
    }
    ctx.putImageData(imageData, 0, 0);
}

// Animation
PLEASE_REDRAW = true;
let animloop = ()=>{
    ANIM_TIMER -= 1/30;
    if(PLEASE_REDRAW || MODE==MODE_RAINBOW_ANIMATION || MODE_GRAYSCALE_ANIMATION){
        redraw();
        PLEASE_REDRAW = false;
    }
    requestAnimationFrame(animloop);
};
requestAnimationFrame(animloop);

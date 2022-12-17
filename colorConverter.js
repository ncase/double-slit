// By Stephen Weiss
// from this GitHub thread: https://gist.github.com/mjackson/5311256
// Modified by Ricardo Fernández Serrata: https://github.com/ncase/double-slit/pull/1

function hsv2rgb(h,s,v){
  /**
   * I: An array of three elements hue (h) ∈ [0, 360], and saturation (s) and value (v) which are ∈ [0, 1]
   * O: An array of red (r), green (g), blue (b), all ∈ [0, 255]
   * Derived from https://en.wikipedia.org/wiki/HSL_and_HSV
   * This stackexchange was the clearest derivation I found to reimplement https://cs.stackexchange.com/questions/64549/convert-hsv-to-rgb-colors
   */

  hprime = h / 60;
  const c = v * s;
  const x = c * (1 - Math.abs(hprime % 2 - 1));
  const m = v - c;
  const rgb = isNaN(hprime) ? [0, 0, 0] : [
    [c, x, 0]
    [x, c, 0]
    [0, c, x]
    [0, x, c]
    [x, 0, c]
    [c, 0, x]
  ][Math.floor(hprime)];

  //return rgb.map(x => Math.round( (x + m)* 0xff))
  // Doing this instead of map, because map+function call is inefficient over so many pixels.
  // This is loop-unrolling & function inlining.
  rgb[0] = Math.round( (rgb[0] + m)*255);
  rgb[1] = Math.round( (rgb[1] + m)*255);
  rgb[2] = Math.round( (rgb[2] + m)*255);
  // to avoid creating a new array,
  // we reuse the existing one
  return rgb;

}

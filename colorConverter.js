// By Stephen Weiss
// from this GitHub thread: https://gist.github.com/mjackson/5311256

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
  let r, g, b;
  if (!hprime) {r = 0; g = 0; b = 0; }
  if (hprime >= 0 && hprime < 1) { r = c; g = x; b = 0}
  if (hprime >= 1 && hprime < 2) { r = x; g = c; b = 0}
  if (hprime >= 2 && hprime < 3) { r = 0; g = c; b = x}
  if (hprime >= 3 && hprime < 4) { r = 0; g = x; b = c}
  if (hprime >= 4 && hprime < 5) { r = x; g = 0; b = c}
  if (hprime >= 5 && hprime < 6) { r = c; g = 0; b = x}

  r = Math.round( (r + m)* 255);
  g = Math.round( (g + m)* 255);
  b = Math.round( (b + m)* 255);

  return [r, g, b]
}
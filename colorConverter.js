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
  let r, g, b;
  if (isNaN(hprime)) {r = 0; g = 0; b = 0; }
  switch (Math.floor(hprime)) {
    case 0: { r = c; g = x; b = 0; break}
    case 1: { r = x; g = c; b = 0; break}
    case 2: { r = 0; g = c; b = x; break}
    case 3: { r = 0; g = x; b = c; break}
    case 4: { r = x; g = 0; b = c; break}
    case 5: { r = c; g = 0; b = x; break}
  }

  // return [r, g, b].map(x => Math.round( (x + m)* 0xff))
  // Doing this instead of map, because map+function call is inefficient over so many pixels
  r = Math.round( (r + m)*255);
  g = Math.round( (g + m)*255);
  b = Math.round( (b + m)*255);
  return [r, g, b];

}

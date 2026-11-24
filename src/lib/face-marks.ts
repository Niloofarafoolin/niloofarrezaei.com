/**
 * Landmarks of the drawn face used in the camera figure and its thumbnail.
 * The face is a drawing. It is not traced from any person.
 */
export type Pt = [number, number];

export const line = (pts: Pt[], close = false) =>
  'M' + pts.map(([x, y]) => `${x} ${y}`).join('L') + (close ? 'Z' : '');
const mirror = (pts: Pt[]): Pt[] => pts.map(([x, y]) => [320 - x, y]);

const browL: Pt[] = [[134, 92], [141, 87], [149, 86], [155, 89]];
const eyeL: Pt[] = [[136, 101], [143, 97], [150, 101], [143, 104]];
const nose: Pt[] = [[160, 98], [160, 110], [160, 120]];
const noseBase: Pt[] = [[152, 123], [160, 126], [168, 123]];
const mouth: Pt[] = [[146, 138], [153, 134], [160, 135], [167, 134], [174, 138], [167, 143], [160, 144], [153, 143]];
const jaw: Pt[] = [[122, 112], [125, 128], [131, 142], [141, 153], [160, 158], [179, 153], [189, 142], [195, 128], [198, 112]];
const browR = mirror(browL);
const eyeR = mirror(eyeL);

export const faceLines = [
  line(browL),
  line(browR),
  line(eyeL, true),
  line(eyeR, true),
  line(nose),
  line(noseBase),
  line(mouth, true),
  line(jaw),
  line([browL[3], nose[0], browR[3]]),
  line([jaw[0], eyeL[0]]),
  line([jaw[8], eyeR[0]]),
  line([eyeL[3], noseBase[0], mouth[0]]),
  line([eyeR[3], noseBase[2], mouth[4]]),
  line([mouth[6], jaw[4]]),
  line([jaw[2], mouth[0]]),
  line([jaw[6], mouth[4]]),
];

export const facePoints: Pt[] = [...browL, ...browR, ...eyeL, ...eyeR, ...nose, ...noseBase, ...mouth, ...jaw];

/** Four corner marks around a box, like a detection frame. */
export const corners = (x0: number, y0: number, x1: number, y1: number, k = 13) =>
  `M${x0} ${y0 + k}V${y0}H${x0 + k}M${x1 - k} ${y0}H${x1}V${y0 + k}M${x1} ${y1 - k}V${y1}H${x1 - k}M${x0 + k} ${y1}H${x0}V${y1 - k}`;

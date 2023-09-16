export interface Ease {
  (p: number): number
}

export enum EASE {
  LINEAR = 'linear',
  BACK_IN = 'backIn',
  BACK_OUT = 'backOut',
  BACK_IN_OUT = 'backInOut',
  BOUNCE_IN = 'bounceIn',
  BOUNCE_OUT = 'bounceOut',
  BOUNCE_IN_OUT = 'bounceInOut',
  CIRC_IN = 'circIn',
  CIRC_OUT = 'circOut',
  CIRC_IN_OUT = 'circInOut',
  CUBIC_IN = 'cubicIn',
  CUBIC_OUT = 'cubicOut',
  CUBIC_IN_OUT = 'cubicInOut',
  EXPO_IN = 'expoIn',
  EXPO_OUT = 'expoOut',
  EXPO_IN_OUT = 'expoInOut',
  QUAD_IN = 'quadIn',
  QUAD_OUT = 'quadOut',
  QUAD_IN_OUT = 'quadInOut',
  QUART_IN = 'quartIn',
  QUART_OUT = 'quartOut',
  QUART_IN_OUT = 'quartInOut',
  QUINT_IN = 'quintIn',
  QUINT_OUT = 'quintOut',
  QUINT_IN_OUT = 'quintInOut',
  SINE_IN = 'sineIn',
  SINE_OUT = 'sineOut',
  SINE_IN_OUT = 'sineInOut',
}

const EaseMap = new Map<EASE, Ease>([
  [EASE.LINEAR,        linear],
  [EASE.BACK_IN,       backIn],
  [EASE.BACK_OUT,      backOut],
  [EASE.BACK_IN_OUT,   backInOut],
  [EASE.BOUNCE_IN,     bounceIn],
  [EASE.BOUNCE_OUT,    bounceOut],
  [EASE.BOUNCE_IN_OUT, bounceInOut],
  [EASE.CIRC_IN,       circIn],
  [EASE.CIRC_OUT,      circOut],
  [EASE.CIRC_IN_OUT,   circInOut],
  [EASE.CUBIC_IN,      cubicIn],
  [EASE.CUBIC_OUT,     cubicOut],
  [EASE.CUBIC_IN_OUT,  cubicInOut],
  [EASE.EXPO_IN,       expoIn],
  [EASE.EXPO_OUT,      expoOut],
  [EASE.EXPO_IN_OUT,   expoInOut],
  [EASE.QUAD_IN,       quadIn],
  [EASE.QUAD_OUT,      quadOut],
  [EASE.QUAD_IN_OUT,   quadInOut],
  [EASE.QUART_IN,      quartIn],
  [EASE.QUART_OUT,     quartOut],
  [EASE.QUART_IN_OUT,  quartInOut],
  [EASE.QUINT_IN,      quintIn],
  [EASE.QUINT_OUT,     quintOut],
  [EASE.QUINT_IN_OUT,  quintInOut],
  [EASE.SINE_IN,       sineIn],
  [EASE.SINE_OUT,      sineOut],
  [EASE.SINE_IN_OUT,   sineInOut],
])

export function applyEase(ease: EASE, value: number): number {
  return getEase(ease)(value)
}

export function getEase(ease: EASE): Ease {
  return EaseMap.get(ease) || linear
}

export function linear(p: number): number {
  return p
}

export function backIn(p: number): number {
  return p * p * (2.70158 * p - 1.70158)
}

export function backOut(p: number): number {
  return (p -= 1) * p * (2.70158 * p + 1.70158) + 1
}

export function backInOut(p: number): number {
  if ((p *= 2) < 1) {
    return 0.5 * p * p * (3.5949095 * p - 2.5949095)
  }
  return 0.5 * ((p -= 2) * p * (3.5949095 * p + 2.5949095) + 2)
}

export function bounceOut(p: number): number {
  if (p < 0.36363636) {
    return 7.5625 * p * p
  } else if (p < 0.72727272) {
    return 7.5625 * (p -= 0.54545454) * p + 0.75
  } else if (p < 0.9090909) {
    return 7.5625 * (p -= 0.81818181) * p + 0.9375
  } else {
    return 7.5625 * (p -= 0.95454545) * p + 0.984375
  }
}

export function bounceIn(p: number): number {
  return 1 - bounceOut(1 - p)
}

export function bounceInOut(p: number): number {
  if (p < 0.5) {
    return bounceIn(p * 2) * 0.5
  }
  return (bounceOut(p * 2 - 1) + 1) * 0.5
}

export function circIn(p: number): number {
  return -Math.sqrt(1 - p * p) + 1
}

export function circOut(p: number): number {
  return Math.sqrt(1 - (p -= 1) * p)
}

export function circInOut(p: number): number {
  if ((p *= 2) < 1) {
    return -0.5 * (Math.sqrt(1 - p * p) - 1)
  }
  return 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1)
}

export function cubicIn(p: number): number {
  return p * p * p
}

export function cubicOut(p: number): number {
  return (p -= 1) * p * p + 1
}

export function cubicInOut(p: number): number {
  if ((p *= 2) < 1) {
    return 0.5 * p * p * p
  }
  return ((p -= 2) * p * p + 2) * 0.5
}

export function expoIn(p: number): number {
  return p === 0 ? 0 : Math.pow(2, 10 * (p - 1)) - 0.001
}

export function expoOut(p: number): number {
  return p === 1 ? 1 : -Math.pow(2, -10 * p) + 1
}

export function expoInOut(p: number): number {
  if (p === 0 || p === 1) {
    return p
  }
  if ((p *= 2) < 1) {
    return 0.5 * Math.pow(2, 10 * (p - 1))
  }
  return 0.5 * (-Math.pow(2, -10 * (p - 1)) + 2)
}

export function quadIn(p: number): number {
  return p * p
}

export function quadOut(p: number): number {
  return -p * (p - 2)
}

export function quadInOut(p: number): number {
  if ((p *= 2) < 1) {
    return 0.5 * p * p
  }
  return -0.5 * (--p * (p - 2) - 1)
}

export function quartIn(p: number): number {
  return p * p * p * p
}

export function quartOut(p: number): number {
  return -((p -= 1) * p * p * p - 1)
}

export function quartInOut(p: number): number {
  if ((p *= 2) < 1) {
    return 0.5 * p * p * p * p
  }
  return -0.5 * ((p -= 2) * p * p * p - 2)
}

export function quintIn(p: number): number {
  return p * p * p * p * p
}

export function quintOut(p: number): number {
  return (p -= 1) * p * p * p * p + 1
}

export function quintInOut(p: number): number {
  if ((p *= 2) < 1) {
    return 0.5 * p * p * p * p * p
  }
  return 0.5 * ((p -= 2) * p * p * p * p + 2)
}

export function sineIn(p: number): number {
  return 1 - Math.cos(-p * Math.PI / 2)
}

export function sineOut(p: number): number {
  return Math.sin(p * Math.PI / 2)
}

export function sineInOut(p: number): number {
  return -0.5 * (Math.cos(Math.PI * p) - 1)
}

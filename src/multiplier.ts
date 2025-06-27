const multipliers = {
  110: {
    label: 'block-110',
    sound: 'sounds/multiplier-best.wav',
    img: 'assets/img/multipliers/multiplier110.png'
  },
  88: {
    label: 'block-88',
    sound: 'sounds/multiplier-best.wav',
    img: 'assets/img/multipliers/multiplier88.png'
  },
  41: {
    label: 'block-41',
    sound: 'sounds/multiplier-best.wav',
    img: 'assets/img/multipliers/multiplier41.png'
  },
  33: {
    label: 'block-33',
    sound: 'sounds/multiplier-best.wav',
    img: 'assets/img/multipliers/multiplier33.png'
  },
  25: {
    label: 'block-25',
    sound: 'sounds/multiplier-best.wav',
    img: 'assets/img/multipliers/multiplier25.png'
  },
  18: {
    label: 'block-18',
    sound: 'sounds/multiplier-best.wav',
    img: 'assets/img/multipliers/multiplier18.png'
  },
  15: {
    label: 'block-15',
    sound: 'sounds/multiplier-good.wav',
    img: 'assets/img/multipliers/multiplier15.png'
  },
  10: {
    label: 'block-10',
    sound: 'sounds/multiplier-good.wav',
    img: 'assets/img/multipliers/multiplier10.png'
  },
  5: {
    label: 'block-5',
    sound: 'sounds/multiplier-good.wav',
    img: 'assets/img/multipliers/multiplier5.png'
  },
  3: {
    label: 'block-3',
    sound: 'sounds/multiplier-regular.wav',
    img: 'assets/img/multipliers/multiplier3.png'
  },
  2: {
    label: 'block-2',
    sound: 'sounds/multiplier-regular.wav',
    img: 'assets/img/multipliers/multiplier2.png'
  },
  1.5: {
    label: 'block-1.5',
    sound: 'sounds/multiplier-regular.wav',
    img: 'assets/img/multipliers/multiplier1.5.png'
  },
  1: {
    label: 'block-1',
    sound: 'sounds/multiplier-regular.wav',
    img: 'assets/img/multipliers/multiplier1.png'
  },
  0.5: {
    label: 'block-0.5',
    sound: 'sounds/multiplier-low.wav',
    img: 'assets/img/multipliers/multiplier0.5.png'
  },
  0.3: {
    label: 'block-0.3',
    sound: 'sounds/multiplier-low.wav',
    img: 'assets/img/multipliers/multiplier0.3.png'
  }
}


export const multiplyBlocks16Lines = [
  getMultiplier(110),
  getMultiplier(41),
  getMultiplier(10),
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(1.5),
  getMultiplier(1),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1),
  getMultiplier(1.5),
  getMultiplier(3),
  getMultiplier(5),
  getMultiplier(10),
  getMultiplier(41),
  getMultiplier(110)
]

export const multiplyBlocks15Lines = [
  getMultiplier(88),
  getMultiplier(18),
  getMultiplier(10),
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(1.5),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1.5),
  getMultiplier(3),
  getMultiplier(5),
  getMultiplier(10),
  getMultiplier(18),
  getMultiplier(88)
]
export const multiplyBlocks14Lines = [
  getMultiplier(41),
  getMultiplier(15),
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(1.5),
  getMultiplier(1),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1),
  getMultiplier(1.5),
  getMultiplier(3),
  getMultiplier(5),
  getMultiplier(15),
  getMultiplier(41)
]
export const multiplyBlocks13Lines = [
  getMultiplier(41),
  getMultiplier(15),
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(1.5),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1.5),
  getMultiplier(3),
  getMultiplier(5),
  getMultiplier(15),
  getMultiplier(41)
]
export const multiplyBlocks12Lines = [
  getMultiplier(33),
  getMultiplier(10),
  getMultiplier(3),
  getMultiplier(2),
  getMultiplier(1.5),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1.5),
  getMultiplier(2),
  getMultiplier(3),
  getMultiplier(10),
  getMultiplier(33)
]
export const multiplyBlocks11Lines = [
  getMultiplier(25),
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(2),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(2),
  getMultiplier(3),
  getMultiplier(5),
  getMultiplier(25)
]
export const multiplyBlocks10Lines = [
  getMultiplier(25),
  getMultiplier(5),
  getMultiplier(2),
  getMultiplier(1.5),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1.5),
  getMultiplier(2),
  getMultiplier(5),
  getMultiplier(25)
]
export const multiplyBlocks9Lines = [
  getMultiplier(10),
  getMultiplier(5),
  getMultiplier(2),
  getMultiplier(1.5),
  getMultiplier(0.3),
  getMultiplier(0.3),
  getMultiplier(1.5),
  getMultiplier(2),
  getMultiplier(5),
  getMultiplier(10)
]
export const multiplyBlocks8Lines = [
  getMultiplier(5),
  getMultiplier(3),
  getMultiplier(1.5),
  getMultiplier(0.5),
  getMultiplier(0.3),
  getMultiplier(0.5),
  getMultiplier(1.5),
  getMultiplier(3),
  getMultiplier(5)
]

export const multiplyBlocksByLines = {
  8: multiplyBlocks8Lines,
  9: multiplyBlocks9Lines,
  10: multiplyBlocks10Lines,
  11: multiplyBlocks11Lines,
  12: multiplyBlocks12Lines,
  13: multiplyBlocks13Lines,
  14: multiplyBlocks14Lines,
  15: multiplyBlocks15Lines,
  16: multiplyBlocks16Lines
}

export function getMultiplierByLines(value: any): any {
  return multiplyBlocksByLines[value]
}


export function getMultiplier(value: any): any {
  return multipliers[value]
}
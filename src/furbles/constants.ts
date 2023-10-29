import { CATEGORY } from 'src/model/creatures'
import { getRandomSeed } from '../lib/seeded-random'
import { PopulationModel } from '../model/population'

export function makeDefaultPopulation(): PopulationModel {
  return {
    colors: ['#ff0000', '#ffa500', '#ffee00', '#00ff00', '#1e90ff', '#0000cd', '#9900ff'],
    count:  25,
    eyes:   ['1', '2', '3', '4', '5'],
    seed:   getRandomSeed(),
    sides:  ['3', '4', '5', '6', '7', '8'],
  }
}

export const COLORS = [
  { name: 'red',    value: '#ff0000' },
  { name: 'orange', value: '#ffa500' },
  { name: 'yellow', value: '#ffee00' },
  { name: 'green',  value: '#00ff00' },
  { name: 'blue',   value: '#1e90ff' },
  { name: 'indigo', value: '#0000cd' },
  { name: 'violet', value: '#9900ff' },
  { name: 'pink',   value: '#ffc0cb' },
  { name: 'brown',  value: '#a52a2a' },
  { name: 'black',  value: '#000000' },
  { name: 'grey',   value: '#808080' },
]

export const COLOR_VALUES = [{ name: 'None', value: 'none' }, ...COLORS]

export const DEFAULT_COLORS = [COLORS[0].value]

export const EYES = [
  { name: 'one',   value: '1' },
  { name: 'two',   value: '2' },
  { name: 'three', value: '3' },
  { name: 'four',  value: '4' },
  { name: 'five',  value: '5' },
]

export const EYES_VALUES = [{ name: 'None', value: 'none' }, ...EYES]

export const DEFAULT_EYES = ['2']

export const SIDES = [
  { name: 'triangle', value: '3' },
  { name: 'square',   value: '4' },
  { name: 'pentagon', value: '5' },
  { name: 'hexagon',  value: '6' },
  { name: 'octagon',  value: '8' },
]

export const SIDES_VALUES = [{ name: 'None', value: 'none' }, ...SIDES]

export const DEFAULT_SIDES = ['4']

export const ALL_CATEGORIES = [
  COLOR_VALUES.map(color => [CATEGORY.COLOR, color.value]),
  EYES_VALUES.map(eyes => [CATEGORY.EYES, eyes.value]),
  SIDES_VALUES.map(sides => [CATEGORY.SIDES, sides.value]),
]

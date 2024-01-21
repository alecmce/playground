import { Point } from './geometry'
import { PopulationModel } from './population'

export interface CreatureDrawProps {
  pointer: Point | null
  scale:   number
  target:  Creature | null
  alpha?:  number
}

export interface Creature {
  center:  Point
  color:   string
  draw:    (props: CreatureDrawProps) => void
  eyes:    string
  id:      string
  isUnder: (pointer: Point) => boolean
  radius:  number
  sides:   string
}

export enum CATEGORY {
  COLOR = 'color',
  EYES  = 'eyes',
  SIDES = 'sides',
}

export const CategoryOptionList = [
  { name: 'Colour', value: CATEGORY.COLOR },
  { name: 'Eyes',   value: CATEGORY.EYES  },
  { name: 'Sides',  value: CATEGORY.SIDES },
]

export interface Categorized<Values> {
  creatures: Creature[]
  values:    Values
  type?:     CATEGORY_TYPE
}

export enum CATEGORY_TYPE {
  EXCLUDED     = 'excluded',
  FIRST        = 'first',
  INTERSECTION = 'intersection',
  SECOND       = 'second',
}

export interface CategoryValues {
  [CATEGORY.COLOR]?: string
  [CATEGORY.EYES]?:  string
  [CATEGORY.SIDES]?: string
}

export interface SetInclusionState {
  [CATEGORY.COLOR]?: string
  [CATEGORY.EYES]?:  string
  [CATEGORY.SIDES]?: string
}

export interface SetInclusionValues {
  [CATEGORY.COLOR]?: string[]
  [CATEGORY.EYES]?:  string[]
  [CATEGORY.SIDES]?: string[]
}

export interface MakeCreatures {
  (model: PopulationModel): Creature[]
}

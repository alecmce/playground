import { Point } from './geometry'

export interface CreatureDrawProps {
  context: CanvasRenderingContext2D
  pointer: Point | null
  scale:   number
  target:  Creature | null
}

export interface Creature {
  center:  Point
  color:   string
  draw:    (props: CreatureDrawProps) => void
  eyes:    string
  isUnder: (pointer: Point) => boolean
  sides:   string
}

export enum CATEGORY {
  COLOR = 'color',
  EYES  = 'eyes',
  SIDES = 'sides',
}

export interface Categorized {
  creatures: Creature[]
  values:    Partial<CategoryValues>
}

export interface CategoryValues {
  [CATEGORY.COLOR]: string
  [CATEGORY.EYES]:  number
  [CATEGORY.SIDES]: number
}

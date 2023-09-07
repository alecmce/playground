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
  eyes:    1 | 2 | 3 | 4 | 5
  isUnder: (pointer: Point) => boolean
  sides:   number
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
  [CATEGORY.EYES]:  1 | 2 | 3 | 4 | 5
  [CATEGORY.SIDES]: number
}

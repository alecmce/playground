import { CATEGORY, Creature, SetInclusionState } from './creatures'
import { Brush, Fill } from './drawing'
import { Point } from './geometry'
import { POINTER_ACTION } from './interaction'

export interface Chart<Definition> {
  drawBackground: (props: BackgroundDrawProps) => void
  drawMain:       (props: MainDrawProps) => void
  getRadius:      () => number
  getScale:       () => number
  init:           (definition: Definition) => void
  reset:          VoidFunction
  setPointer:     (pointer: Point, action: POINTER_ACTION) => void
  update:         (proportion: number) => void
}

export type CategorisationChart = Chart<CATEGORY[]>
export type SetInclusionChart = Chart<[SetInclusionState, SetInclusionState]>

export interface MainDrawProps {
  brush?:  Brush
  alpha?:  number
}

export interface BackgroundDrawProps {
  brush?:  Brush
  fill?:   Fill
}

export interface Assignment<T extends Point, Categories> {
  categories: Categories
  creature:   Creature
  distance:   number
  place:      T
  start:      Point
}

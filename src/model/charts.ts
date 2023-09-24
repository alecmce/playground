import { CATEGORY, Creature } from './creatures'
import { Brush, Fill } from './drawing'
import { Point } from './geometry'
import { POINTER_ACTION } from './interaction'

export interface Chart {
  drawBackground: (props: BackgroundDrawProps) => void
  drawMain:       (props: MainDrawProps) => void
  getRadius:      () => number
  getScale:       () => number
  init:           (categories: CATEGORY[]) => void
  reset:          VoidFunction
  setPointer:     (pointer: Point, action: POINTER_ACTION) => void
  update:         (proportion: number) => void
}

export interface MainDrawProps {
  context: CanvasRenderingContext2D
  brush?:  Brush
  alpha?:  number
}

export interface BackgroundDrawProps {
  context: CanvasRenderingContext2D
  brush?:  Brush
  fill?:   Fill
}

export interface Assignment<T extends Point = Point> {
  categories: Partial<Record<CATEGORY, string | number>>
  creature:   Creature
  distance:   number
  place:      T
  start:      Point
}

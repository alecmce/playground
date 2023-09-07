import { CATEGORY } from './creatures'
import { Brush, Fill } from './drawing'
import { Point } from './geometry'

export interface PieChart {
  drawPie:    (props: DrawPieProps) => void
  drawSpaces: (props: DrawSpacesProps) => void
  init:       (categories: CATEGORY[]) => void
  places:     Point[]
  radius:     number
  reset:      VoidFunction
  scale:      number
  update:     (proportion: number) => void
}

export interface DrawPieProps {
  context: CanvasRenderingContext2D
  brush?:  Brush
  alpha?:  number
}

export interface DrawSpacesProps {
  context: CanvasRenderingContext2D
  brush?:  Brush
  fill?:   Fill
}

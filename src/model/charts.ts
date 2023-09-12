import { CATEGORY } from './creatures'
import { Brush, Fill } from './drawing'

export interface Chart {
  drawMain:       (props: MainDrawProps) => void
  drawBackground: (props: BackgroundDrawProps) => void
  init:           (categories: CATEGORY[]) => void
  getRadius:      () => number
  reset:          VoidFunction
  getScale:       () => number
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

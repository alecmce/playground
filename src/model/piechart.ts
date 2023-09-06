import { Brush, Fill } from './drawing'
import { Point } from './geometry'

export interface PieChart {
  places:     Point[]
  radius:     number
  scale:      number
  gotoPlaces: (proportion: number) => void
  reset:      VoidFunction
  draw:       (props: PieChartDrawProps) => void
}

export interface PieChartDrawProps {
  context: CanvasRenderingContext2D
  brush?:  Brush
  fill?:   Fill
}
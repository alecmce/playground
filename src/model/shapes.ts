import { Fill } from './drawing'
import { Polygon } from './geometry'

export interface Shape {
  polygon: Polygon
  fill:    Fill
}

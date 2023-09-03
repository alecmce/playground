import { Fill } from './drawing'
import { Polygon } from './geometry'

export interface Shape {
  polygon: Polygon
  fill:    Fill
  eyes:    1 | 2 | 3 | 4 | 5
}

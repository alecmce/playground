import { drawPolygon } from './draw-polygon'
import { Brush, Fill } from 'src/model/drawing'
import { Point, Polygon } from 'src/model/geometry'
import { SeededRandom } from 'src/model/random'
import { makeRegularPolygon } from '../lib/polygon'


interface Props {
  brush:  Brush
  colors: string[]
  count:  number
  radius: number
  random: SeededRandom
  sides:  number[]
}

interface Shape {
  polygon: Polygon
  fill:    Fill
}

interface Draw {
  (context: CanvasRenderingContext2D, points: Point[]): void
}

export function makeShapes(props: Props): Draw {
  const { brush, colors: colorsList, count, radius, random, sides: sidesList } = props

  const shapes = Array.from({ length: count }, makeShape)

  return function draw(context: CanvasRenderingContext2D, points: Point[]): void {
    shapes.forEach(drawShape)

    function drawShape(shape: Shape, index: number): void {
      const { polygon, fill } = shape
      drawPolygon({ brush, context, fill, offset: points[index], polygon })
    }
  }

  function makeShape(): Shape {
    const sides = random.from(sidesList)
    const color = random.from(colorsList)
    const rotation = random.float(0, 2 * Math.PI)
    const polygon = makeRegularPolygon({ center: { x: 0, y: 0 }, radius, rotation, sides })
    return { fill: { alpha: 1, color }, polygon }
  }
}

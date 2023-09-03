import { mix } from 'chroma-js'
import { Brush, Fill } from 'src/model/drawing'
import { Point } from 'src/model/geometry'
import { SeededRandom } from 'src/model/random'
import { Shape } from 'src/model/shapes'
import { makeRegularPolygon } from '../lib/polygon'
import { drawEyes } from './draw-eye'
import { drawPolygon } from './draw-polygon'


interface Props {
  brush:   Brush
  colors:  string[]
  count:   number
  radius:  number
  random:  SeededRandom
  sides:   number[]
  eyes:    number[]
}

interface DrawProps {
  context: CanvasRenderingContext2D
  pointer: Point | null
  points:  Point[]
  target:  Point | null
}

interface Draw {
  (props: DrawProps): void
}

export function makeShapes(props: Props): Draw {
  const { brush, colors: colorsList, count, eyes: eyesList, radius, random, sides: sidesList } = props

  const shapes = Array.from({ length: count }, makeShape)

  return function draw(props: DrawProps): void {
    const { context, pointer, points, target } = props
    shapes.forEach(drawShape)

    function drawShape(shape: Shape, index: number): void {
      const { eyes, fill: shapeFill, polygon } = shape
      const offset = points[index]
      const fill = offset === target
        ? { alpha: 1, color: mix(shapeFill.color, 'white', 0.3).hex() } as Fill
        : shapeFill
      drawPolygon({ brush, context, fill, offset, polygon })
      drawEyes({ brush, center: offset, context, eyes, pointer })
    }
  }

  function makeShape(): Shape {
    const sides = random.from(sidesList)
    const color = random.from(colorsList)
    const eyes = random.from(eyesList)
    const rotation = random.float(0, 2 * Math.PI)
    const polygon = makeRegularPolygon({ center: { x: 0, y: 0 }, radius, rotation, sides })
    return { eyes, fill: { alpha: 1, color }, polygon }
  }
}

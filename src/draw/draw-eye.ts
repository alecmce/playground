import { Brush, Fill } from 'src/model/drawing'
import { Circle, Point } from 'src/model/geometry'
import { drawCircle } from './draw-circle'

// closed lid?
// const PATH = new Path2D('M-12.5 1C-9.5 10.5 10 11.5 12.5 1')

const WHITE_FILL: Fill = { alpha: 1, color: '#fff' }
const WHITE_RADIUS = 14

const IRIS_FILL: Fill = { alpha: 1, color: '#000' }
const IRIS_RADIUS = 6

const OFFSET = WHITE_RADIUS - IRIS_RADIUS

interface Props {
  brush:   Brush
  center:  Point
  context: CanvasRenderingContext2D
  pointer: Point | null
}

export function drawEye(props: Props): void {
  const { brush, center, context, pointer } = props

  drawCircle({ fill: WHITE_FILL, brush, circle: { center, radius: WHITE_RADIUS }, context })
  drawCircle({ fill: IRIS_FILL, circle: getIrisCircle(center), context })

  function getIrisCircle(origin: Point): Circle {
    const dx = pointer ? pointer.x - origin.x : 0
    const dy = pointer ? pointer.y - origin.y : 0
    const distance = Math.hypot(dx, dy)

    const center = distance < OFFSET
      ? { x: origin.x + dx, y: origin.y + dy }
      : { x: origin.x + dx * OFFSET / distance, y: origin.y + dy * OFFSET / distance }

    return { center, radius: IRIS_RADIUS }
  }
}

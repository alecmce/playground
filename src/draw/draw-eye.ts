import { Brush, Fill } from 'src/model/drawing'
import { Circle, Point } from 'src/model/geometry'
import { drawCircle } from './draw-circle'

// closed lid?
// const PATH = new Path2D('M-12.5 1C-9.5 10.5 10 11.5 12.5 1')

const FILL: Fill = { alpha: 1, color: '#fff' }
const RADIUS = 14

const IRIS_FILL: Fill = { alpha: 1, color: '#000' }
const IRIS_RADIUS = 6

const OFFSET = RADIUS - IRIS_RADIUS

interface Props {
  brush:   Brush
  center:  Point
  context: CanvasRenderingContext2D
  pointer: Point | null
  eyes:    number
}

const DELTA = RADIUS * Math.sqrt(3) / 2

const ONE_EYE = [{ x: 0, y: 0 }]
const TWO_EYES = [{ x: -RADIUS, y: 0 }, { x: +RADIUS, y: 0 }]
const THREE_EYES = [{ x: -RADIUS, y: -DELTA }, { x: 0, y: DELTA }, { x: +RADIUS, y: -DELTA }]
const FOUR_EYES = [{ x: -RADIUS, y: -RADIUS }, { x: -RADIUS, y: +RADIUS }, { x: +RADIUS, y: -RADIUS }, { x: +RADIUS, y: +RADIUS }]
const POSITION_CACHE = new Map<number, Point[]>()


export function drawEyes(props: Props): void {
  const { brush, center: shapeCenter, context, eyes, pointer } = props

  getOffsets().forEach(drawEye)

  function getOffsets(): Point[] {
    switch (eyes) {
      case 1:  return ONE_EYE
      case 2:  return TWO_EYES
      case 3:  return THREE_EYES
      case 4:  return FOUR_EYES
      default: return POSITION_CACHE.get(eyes) ?? cacheOffsets()
    }

    function cacheOffsets(): Point[] {
      const left = (eyes % 2 === 0 ? -DELTA : 0) - (eyes - 1) * RADIUS
      const offsets = Array.from({ length: eyes }, getOffset)
      POSITION_CACHE.set(eyes, offsets)
      return offsets

      function getOffset(_: unknown, index: number): Point {
        const dx = left + index * RADIUS * 2
        const dy = (index % 2 === 0 ? -1 : 1) * RADIUS / 2
        return { x: dx, y: dy }
      }
    }
  }

  function drawEye(offset: Point): void {
    const origin = { x: shapeCenter.x + offset.x, y: shapeCenter.y + offset.y }

    drawCircle({ fill: FILL, brush, circle: { center: origin, radius: RADIUS }, context })
    drawCircle({ fill: IRIS_FILL, circle: getIrisCircle(), context })


    function getIrisCircle(): Circle {
      const dx = pointer ? pointer.x - origin.x : 0
      const dy = pointer ? pointer.y - origin.y : 0
      const distance = Math.hypot(dx, dy)

      const center = distance < OFFSET
        ? { x: origin.x + dx, y: origin.y + dy }
        : { x: origin.x + dx * OFFSET / distance, y: origin.y + dy * OFFSET / distance }

      return { center, radius: IRIS_RADIUS }
    }
  }
}

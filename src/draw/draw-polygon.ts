import { Drawing } from 'src/model/drawing'
import { Point, Polygon } from 'src/model/geometry'
import { applyBrush } from './apply-brush'
import { applyFill } from './apply-fill'

interface Props extends Drawing {
  offset?: Point
  polygon: Polygon
}

export function drawPolygon(props: Props): void {
  const { brush, context, fill, offset = { x: 0, y: 0 }, polygon } = props

  fill && applyFill({ fill, context, draw })
  brush && applyBrush({ brush, context, draw })

  function draw(): void {
    context.beginPath()
    moveTo(polygon.at(-1)!)
    polygon.forEach(lineTo)
    context.closePath()
  }

  function moveTo(point: Point): void {
    context.moveTo(point.x + offset.x, point.y + offset.y)
  }

  function lineTo(point: Point): void {
    context.lineTo(point.x + offset.x, point.y + offset.y)
  }
}

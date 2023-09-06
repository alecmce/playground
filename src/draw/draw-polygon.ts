import { Drawing } from 'src/model/drawing'
import { Point, Polygon } from 'src/model/geometry'
import { applyBrush } from './apply-brush'
import { applyFill } from './apply-fill'

interface Props extends Drawing {
  center?: Point
  polygon: Polygon
  scale?:  number
}

export function drawPolygon(props: Props): void {
  const { brush, context, fill, center = { x: 0, y: 0 }, polygon, scale = 1 } = props

  fill && applyFill({ fill, context, draw })
  brush && applyBrush({ brush, context, draw })

  function draw(): void {
    context.beginPath()
    moveTo(polygon.at(-1)!)
    polygon.forEach(lineTo)
    context.closePath()
  }

  function moveTo(point: Point): void {
    context.moveTo(center.x + point.x * scale, center.y + point.y * scale)
  }

  function lineTo(point: Point): void {
    context.lineTo(center.x + point.x * scale, center.y + point.y * scale)
  }
}

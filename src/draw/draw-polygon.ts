import { DrawPolygon, DrawPolygonProps, DrawingPrerequisites } from 'src/model/drawing'
import { Point } from 'src/model/geometry'

export function makeDrawPolygon(props: DrawingPrerequisites): DrawPolygon {
  const { applyBrush, applyFill, brush: defaultBrush = null, context } = props

  return function drawPolygon(props: DrawPolygonProps): void {
    const { brush = defaultBrush, fill, center = { x: 0, y: 0 }, polygon, scale = 1 } = props

    fill && applyFill({ fill, draw })
    brush && applyBrush({ brush, draw })

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
}

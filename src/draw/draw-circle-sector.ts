import { DrawCircleSector, DrawCircleSectorProps, DrawingPrerequisites } from 'src/model/drawing'
import { Point } from 'src/model/geometry'

export function makeDrawCircleSector(props: DrawingPrerequisites): DrawCircleSector {
  const { applyBrush, applyFill, context } = props

  return function drawCircleSector(props: DrawCircleSectorProps): void {
    const { brush, fill, circle, angle, theta, inner = 0 } = props
    const { center, radius } = circle

    const a = getPoint(angle, inner)
    const b = getPoint(angle + theta, radius)

    fill && applyFill({ fill, draw })
    brush && applyBrush({ brush, draw })

    function draw(): void {
      context.beginPath()
      context.moveTo(a.x, a.y)
      context.arc(center.x, center.y, inner, angle, angle + theta)
      context.lineTo(b.x, b.y)
      context.arc(center.x, center.y, radius, angle + theta, angle, true)
      context.lineTo(a.x, a.y)
      context.closePath()
    }

    function getPoint(angle: number, radius: number): Point {
      return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) }
    }
  }
}

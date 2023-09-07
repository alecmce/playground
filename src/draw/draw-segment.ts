import { Drawing } from 'src/model/drawing'
import { Circle, Point } from 'src/model/geometry'
import { applyBrush } from './apply-brush'
import { applyFill } from './apply-fill'

interface Props extends Drawing {
  angle:  number
  circle: Circle
  theta:  number
  inner?: number
}

export function drawCircleSector(props: Props): void {
  const { brush, context, fill, circle, angle, theta, inner = 0 } = props
  const { center, radius } = circle

  const a = getPoint(angle, inner)
  const b = getPoint(angle + theta, radius)

  fill && applyFill({ fill, context, draw })
  brush && applyBrush({ brush, context, draw })

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

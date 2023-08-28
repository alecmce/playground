import { Drawing } from 'src/model/drawing'
import { Circle } from 'src/model/geometry'
import { applyBrush } from './apply-brush'
import { applyFill } from './apply-fill'

interface Props extends Drawing {
  circle: Circle
}

export function drawCircle(props: Props): void {
  const { brush, context, fill, circle } = props
  const { center, radius } = circle

  fill && applyFill({ fill, context, draw })
  brush && applyBrush({ brush, context, draw })

  function draw(): void {
    context.beginPath()
    context.arc(center.x, center.y, radius, 0, 2 * Math.PI)
    context.closePath()
  }
}

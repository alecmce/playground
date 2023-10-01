import { DrawCircle, DrawCircleProps, DrawingPrerequisites } from 'src/model/drawing'


export function makeDrawCircle(props: DrawingPrerequisites): DrawCircle {
  const { applyBrush, applyFill, brush: defaultBrush = null, context } = props

  return function drawCircle(props: DrawCircleProps): void {
    const { brush = defaultBrush, circle, fill } = props
    const { center, radius } = circle

    fill && applyFill({ fill, draw })
    brush && applyBrush({ brush, draw })

    function draw(): void {
      if (radius > 0) {
        context.beginPath()
        context.arc(center.x, center.y, radius, 0, 2 * Math.PI)
        context.closePath()
      }
    }
  }
}

import { Drawing } from 'src/model/drawing'
import { Rectangle } from 'src/model/geometry'
import { applyBrush } from './apply-brush'
import { applyFill } from './apply-fill'

interface Props extends Drawing {
  rectangle: Rectangle
}

export function drawRectangle(props: Props): void {
  const { brush, context, fill, rectangle } = props
  const { left, right, top, bottom } = rectangle

  fill && applyFill({ fill, context, draw })
  brush && applyBrush({ brush, context, draw })

  function draw(): void {
    context.beginPath()
    context.rect(left, top, right - left, bottom - top)
  }
}

import { Brush, DrawingPrerequisites, Fill } from 'src/model/drawing'
import { Rectangle } from 'src/model/geometry'

export interface DrawRectangle {
  (props: DrawRectangleProps): void
}

interface DrawRectangleProps {
  brush?:    Brush
  fill?:     Fill
  rectangle: Rectangle
}

export function makeDrawRectangle(props: DrawingPrerequisites): DrawRectangle {
  const { applyBrush, applyFill, context } = props

  return function drawRectangle(props: DrawRectangleProps): void {
    const { brush, fill, rectangle } = props
    const { left, right, top, bottom } = rectangle

    fill && applyFill({ fill, draw })
    brush && applyBrush({ brush, draw })

    function draw(): void {
      context.beginPath()
      context.rect(left, top, right - left, bottom - top)
    }
  }
}

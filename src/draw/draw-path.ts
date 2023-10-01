import { Brush, DrawPath, DrawPathProps } from 'src/model/drawing'
import { ApplyBrush } from './apply-brush'
import { ApplyFill } from './apply-fill'
import { Point } from 'src/model/geometry'

interface Props {
  center?:    Point
  brush:      Brush | null
  applyFill:  ApplyFill
  applyBrush: ApplyBrush
  context:    CanvasRenderingContext2D
}

export function makeDrawPath(props: Props): DrawPath {
  const { applyBrush, applyFill, brush: defaultBrush = null, context } = props

  return function drawPath(props: DrawPathProps): void {
    const { brush = defaultBrush, center, path, fill } = props

    center && context.translate(center.x, center.y)
    fill && applyFill({ fill, draw: path })
    brush && applyBrush({ brush, draw: path })
    context.resetTransform()
  }
}

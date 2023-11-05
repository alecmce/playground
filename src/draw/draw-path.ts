import { DrawPath, DrawPathProps } from 'src/model/drawing'
import { Point } from 'src/model/geometry'
import { ApplyBrush } from './apply-brush'
import { ApplyFill } from './apply-fill'

interface Props {
  center?:    Point
  applyFill:  ApplyFill
  applyBrush: ApplyBrush
  context:    CanvasRenderingContext2D
}

export function makeDrawPath(props: Props): DrawPath {
  const { applyBrush, applyFill, context } = props

  return function drawPath(props: DrawPathProps): void {
    const { brush, center, path, fill } = props

    center && context.translate(center.x, center.y)
    fill && applyFill({ fill, draw: path })
    brush && applyBrush({ brush, draw: path })
    context.resetTransform()
  }
}

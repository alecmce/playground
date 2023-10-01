import { Brush } from 'src/model/drawing'

interface Props {
  context: CanvasRenderingContext2D
}

export interface ApplyBrush {
  (props: ApplyBrushProps): void
}

interface ApplyBrushProps {
  brush: Brush
  draw:  VoidFunction | Path2D
}


export function makeApplyBrush(props: Props): ApplyBrush {
  const { context } = props

  return function applyBrush(props: ApplyBrushProps): void {
    const { brush, draw } = props

    context.save()
    context.globalAlpha = brush.alpha ?? 1
    context.strokeStyle = brush.color
    context.lineWidth = brush.width
    context.lineCap = brush.cap ?? 'square'
    context.lineJoin = brush.join ?? 'miter'
    context.setLineDash(brush.dashes?.segments ?? [])
    context.lineDashOffset = brush.dashes?.offset ?? 0

    if (draw instanceof Path2D) {
      context.stroke(draw)
    } else {
      draw()
      context.stroke()
    }

    context.restore()
  }
}

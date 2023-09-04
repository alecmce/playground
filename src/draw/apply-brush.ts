import { Brush } from 'src/model/drawing'

interface Props {
  brush:   Brush
  context: CanvasRenderingContext2D
  draw:    VoidFunction
}

export function applyBrush(props: Props): void {
  const { brush, context, draw } = props

  context.save()
  context.globalAlpha = brush.alpha ?? 1
  context.strokeStyle = brush.color
  context.lineWidth = brush.width
  context.lineCap = brush.cap ?? 'square'
  context.lineJoin = brush.join ?? 'miter'
  context.setLineDash(brush.dashes?.segments ?? [])
  context.lineDashOffset = brush.dashes?.offset ?? 0

  draw()
  context.stroke()

  context.restore()
}

import { Fill } from 'src/model/drawing'

interface Props {
  context: CanvasRenderingContext2D
  draw:    VoidFunction
  fill:    Fill
}

export function applyFill(props: Props): void {
  const { context, draw, fill } = props

  context.save()
  context.globalAlpha = fill.alpha ?? 1
  context.fillStyle = fill.color

  draw()
  context.fill()

  context.restore()
}

import { Fill } from 'src/model/drawing'
import { GetGradient } from './gradients'

interface Props {
  context:     CanvasRenderingContext2D
  getGradient: GetGradient
}

export interface ApplyFill {
  (props: ApplyFillProps): void
}

interface ApplyFillProps {
  draw:        VoidFunction | Path2D
  fill:        Fill
}

export function makeApplyFill(props: Props): ApplyFill {
  const { context, getGradient } = props

  return function applyFill(props: ApplyFillProps): void {
    const { draw, fill } = props
    const { alpha, color } = fill

    context.save()
    context.globalAlpha = alpha ?? 1
    context.fillStyle = getFillStyle(color)

    if (draw instanceof Path2D) {
      context.fill(draw)
    } else {
      draw()
      context.fill()
    }

    context.restore()
  }

  function getFillStyle(color: string | string[]): string | CanvasGradient | CanvasPattern {
    return Array.isArray(color)
      ? getFillStyleFromArray(color)
      : color

    function getFillStyleFromArray(color: string[]): string | CanvasGradient | CanvasPattern {
      return color.length > 1
        ? getGradient(color)
        : color.at(0) ?? '#999'
    }
  }
}

interface Props {
  context: CanvasRenderingContext2D
}

export interface GetGradient {
  (colors: string[]): CanvasGradient
}

export function makeGetGradient(props: Props): GetGradient {
  const { context } = props

  const cache: Record<string, CanvasGradient> = {}

  return function getGradient(colors: string[]): CanvasGradient {
    if (colors.length <= 1) {
      throw new Error('A gradient must have at least two colors')
    }

    const key = colors.join(',')
    return cache[key] ??= makeGradient(colors)
  }

  function makeGradient(colors: string[]): CanvasGradient {
    const gradient = context.createLinearGradient(1, 0, 0, 1)
    colors.forEach(addStop)
    return gradient

    function addStop(color: string, index: number): void {
      gradient.addColorStop(index / (colors.length - 1), color)
    }
  }
}

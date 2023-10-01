import { Dispatch, SetStateAction, useEffect, useState } from 'react'


type Output = [
  canvas:    HTMLCanvasElement | null,
  context:   CanvasRenderingContext2D | null,
  setCanvas: Dispatch<SetStateAction<HTMLCanvasElement | null>>,
]

interface Props {
  alpha?: boolean
}

export function useInitCanvas(props: Props = {}): Output {
  const { alpha = true } = props

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    const context = canvas?.getContext('2d', { alpha }) ?? null
    setContext(context)
    if (context) {
      context.imageSmoothingEnabled = true
    }
  }, [canvas, setContext])

  return [canvas, context, setCanvas]
}

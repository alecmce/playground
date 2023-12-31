import { ReactElement, useEffect, useMemo, useState } from 'react'
import { makeDrawCircle } from 'src/draw/draw-circle'
import { makeDrawEyes } from 'src/draw/draw-eyes'
import { makeDrawingPrerequisites } from 'src/draw/drawing-api'
import { DrawEyes } from 'src/model/drawing'
import { Point } from 'src/model/geometry'
import { useInitCanvas } from 'src/use-init-canvas'

const RESOLUTION = 2

interface Props {
  value: string
  size:  number
}

export function NumberOfEyes(props: Props): ReactElement | null {
  const { value: eyes, size } = props

  const resSize = RESOLUTION * size

  const [canvas, context, setCanvas] = useInitCanvas({ alpha: true })
  const [pointer, setPointer] = useState<Point>({ x: size / 2, y: size / 2 })

  const drawEyes = useMemo(() => {
    return context ? makeDrawEyesromContext(context) : undefined
  }, [context])

  useEffect(() => {
    let center: Point
    if (canvas) {
      const p = canvas.getBoundingClientRect()
      center = { x: (p.left + p.right) / 2 - resSize / 2, y: (p.top + p.bottom) / 2 - resSize / 2 }
      window.addEventListener('pointermove', onPointerMove)
    }

    return function unmount(): void {
      window.removeEventListener('pointermove', onPointerMove)
    }

    function onPointerMove(event: PointerEvent): void {
      setPointer({ x: event.clientX - center.x, y: event.clientY - center.y })
    }
  }, [canvas])

  if (drawEyes && eyes) {
    const center = { x: resSize / 2, y: resSize / 2 }
    const scale = resSize / 80
    drawEyes({ center, eyes, pointer, scale })
  }

  return eyes
    ? <canvas ref={setCanvas} width={resSize} height={resSize} style={{width: size, height: size }} />
    : null
}

function makeDrawEyesromContext(context: CanvasRenderingContext2D): DrawEyes {
  const props = makeDrawingPrerequisites({ context })
  const drawCircle = makeDrawCircle(props)
  return makeDrawEyes({ drawCircle })
}

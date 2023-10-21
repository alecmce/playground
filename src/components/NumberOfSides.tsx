import { ReactElement, useMemo } from 'react'
import { makeDrawPolygon } from 'src/draw/draw-polygon'
import { makeDrawingPrerequisites } from 'src/draw/drawing-api'
import { makeRegularPolygon } from 'src/lib/regular-polygon'
import { DrawPolygon } from 'src/model/drawing'
import { Polygon } from 'src/model/geometry'
import { useInitCanvas } from 'src/use-init-canvas'

const BRUSH = { alpha: 1, color: 'black', width: 2 } as const

interface Props {
  value: string
  size:  number
}

export function NumberOfSides(props: Props): ReactElement | null {
  const { value, size } = props

  const polygon = useMemo(() => {
    return value ? makePolygon() : undefined

    function makePolygon(): Polygon {
      return makeRegularPolygon({
        center: { x: 0, y: 0 },
        radius: size / 2,
        sides: parseInt(value, 10),
      })
    }
  }, [value, size])

  const [, context, setCanvas] = useInitCanvas({ alpha: true })

  const drawPolygon = useMemo(() => {
    return context ? makeDrawPolygonFromContext(context) : undefined
  }, [context])

  if (drawPolygon && polygon) {
    const center = { x: size / 2, y: size / 2 }
    const scale = size / 70
    drawPolygon({ center, polygon, scale })
  }

  return value
    ? <canvas ref={setCanvas} width={size} height={size} style={{width: size, height: size }} />
    : null
}

function makeDrawPolygonFromContext(context: CanvasRenderingContext2D): DrawPolygon {
  const props = makeDrawingPrerequisites({ brush: BRUSH, context })
  return makeDrawPolygon(props)
}

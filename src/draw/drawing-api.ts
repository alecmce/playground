import { useMemo } from 'react'
import { makeDrawIcon } from 'src/lib/draw-icon'
import { DrawingApi, DrawingPrerequisites } from 'src/model/drawing'
import { Size } from 'src/model/values'
import { makeApplyBrush } from './apply-brush'
import { makeApplyFill } from './apply-fill'
import { makeDrawCircle } from './draw-circle'
import { makeDrawCircleSector } from './draw-circle-sector'
import { makeDrawEyes } from './draw-eyes'
import { makeDrawPath } from './draw-path'
import { makeDrawPolygon } from './draw-polygon'
import { makeDrawRectangle } from './draw-rectangle'
import { makeGetGradient } from './gradients'

interface Props {
  context?: CanvasRenderingContext2D | null
}

export function useDrawingApi(props: Props): DrawingApi | undefined {
  const { context } = props

  return useMemo(()  => {
    return context ? makeDrawingApi({ context }) : undefined
  }, [context])
}

interface DrawingApiProps {
  context: CanvasRenderingContext2D
}

export function makeDrawingApi(props: DrawingApiProps): DrawingApi {
  const { context } = props

  const config = makeDrawingPrerequisites(props)

  const drawCircle = makeDrawCircle(config)
  const drawCircleSector = makeDrawCircleSector(config)
  const drawEyes = makeDrawEyes({ drawCircle })
  const drawPath = makeDrawPath(config)
  const drawPolygon = makeDrawPolygon(config)
  const drawRectangle = makeDrawRectangle(config)
  const drawIcon = makeDrawIcon({ drawEyes, drawPath, drawPolygon })

  return { ...config, clear, drawCircle, drawCircleSector, drawEyes, drawIcon, drawPath, drawPolygon, drawRectangle }

  function clear(size: Size): void {
    const {width, height } = size

    context.save()
    context.fillStyle = '#fff'
    context.fillRect(0, 0, width, height)
    context.restore()
  }
}

export function makeDrawingPrerequisites(props: DrawingApiProps): DrawingPrerequisites {
  const getGradient = makeGetGradient(props)
  const applyBrush = makeApplyBrush(props)
  const applyFill = makeApplyFill({ ...props, getGradient })
  return { ...props, applyBrush, applyFill }
}

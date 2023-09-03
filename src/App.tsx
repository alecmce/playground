import { Fragment, ReactElement, useCallback, useMemo, useState } from 'react'
import './App.css'
import { makeShapes } from './draw/shapes'
import { useClampPoint } from './lib/clamp-point'
import { makeTwister } from './lib/mersenne-twister'
import { makePositions } from './lib/positions'
import { pushApart } from './lib/push-apart'
import { useRadius } from './lib/use-radius'
import { useShapesDrag } from './lib/use-shapes-drag'
import { useTick } from './lib/use-tick'
import { useWindowSize } from './lib/use-window-size'
import { Point } from './model/geometry'

const BRUSH = { alpha: 1, color: 'black', width: 3 } as const
const COLORS = ['#ff0000', '#ffa500', '#ffee00', '#00ff00', '#1e90ff', '#0000cd', '#9900ff']
const SIDES = [3, 4, 5, 6, 7, 8]
const EYES = [1, 2, 3, 4, 5] as Array<1 | 2 | 3 | 4 | 5>
const SCALAR = 0.01 as const
const COUNT = 100 as const
const DENSITY = 0.5 as const

export function App(): ReactElement {
  const size = useWindowSize()
  const { width, height } = size

  const random = useMemo(() => makeTwister(Math.random()), [])

  const radius = useRadius({ count: COUNT, density: DENSITY, size })
  const initial = useMemo(() => makePositions({ count: COUNT, radius, size }), [])
  const [pointer, setPointer] = useState<Point | null>(null)
  const [positions, setPositions] = useState(initial)
  const { points } = initial

  const clampPoint = useClampPoint({ radius, size })
  const drawShapes = useMemo(() => makeShapes({ brush: BRUSH, colors: COLORS, count: COUNT, eyes: EYES, radius, random, sides: SIDES}), [])

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [target, setTarget] = useState<Point | null>(null)

  useShapesDrag({ clampPoint, positions, radius, setPointer, setPositions, setTarget })

  const iterate = useCallback(() => {
    setPositions(positions => pushApart({ positions, radius, size, scalar: SCALAR }))
  }, [setPositions])

  useTick(iterate)

  const context = canvas?.getContext('2d')
  if (context) {
    context.clearRect(0, 0, width, height)
    drawShapes({ context, points, pointer, target })
  }

  return (
    <Fragment>
      <canvas ref={setCanvas} width={width} height={height} className="layer" />
      <div className="layer">
        <div className="overlay">Hello Playground</div>
      </div>
    </Fragment>
  )
}

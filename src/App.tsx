import { Fragment, ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { makeShapes } from './draw/shapes'
import { useClampPoint } from './lib/clamp-point'
import { makeTwister } from './lib/mersenne-twister'
import { makePositions } from './lib/positions'
import { pushApart } from './lib/push-apart'
import { useShapesDrag } from './lib/use-shapes-drag'
import { useTick } from './lib/use-tick'
import { useWindowSize } from './lib/use-window-size'
import { Point } from './model/geometry'

const BRUSH = { alpha: 1, color: 'white', width: 4 } as const
const COLORS = ['#ff0000', '#ffa500', '#ffee00', '#00ff00', '#1e90ff', '#0000cd', '#9900ff']
const SIDES = [3, 4, 5, 6, 7, 8]
const SCALAR = 0.01 as const
const COUNT = 25 as const
const DENSITY = 0.5 as const

export function App(): ReactElement {
  const { width, height } = useWindowSize()

  const random = useMemo(() => makeTwister(Math.random()), [])

  const initial = useMemo(() => makePositions({ count: COUNT, density: DENSITY, height, width }), [width, height])
  const [positions, setPositions] = useState(initial)
  const { points, radius } = initial
  const { version } = positions

  const clampPoint = useClampPoint({ width, height, radius })
  const drawShapes = useMemo(() => makeShapes({ brush: BRUSH, colors: COLORS, radius, random, sides: SIDES, count: COUNT }), [width, height])

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [target, setTarget] = useState<Point | null>(null)

  useShapesDrag({ clampPoint, positions, radius, setTarget, setPositions })

  const iterate = useCallback(() => {
    setPositions(positions => pushApart({ positions, width, height, scalar: SCALAR }))
  }, [setPositions, width, height])

  useTick(iterate)

  useEffect(() => {
    const context = canvas?.getContext('2d')
    if (context) {
      context.clearRect(0, 0, width, height)
      drawShapes({ context, points, target })
    }
  }, [canvas, drawShapes, points, target, version])

  return (
    <Fragment>
      <canvas ref={setCanvas} width={width} height={height} className="layer" />
      <div className="layer">
        <div className="overlay">Hello Playground</div>
      </div>
    </Fragment>
  )
}

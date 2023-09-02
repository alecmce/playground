import { Fragment, ReactElement, useEffect, useMemo, useState } from 'react'
import './App.css'
import { makeShapes } from './draw/shapes'
import { makeTwister } from './lib/mersenne-twister'
import { makePositions } from './lib/positions'
import { pushApart } from './lib/push-apart'
import { useShapesDrag } from './lib/use-shapes-drag'
import { useWindowSize } from './lib/use-window-size'
import { Point } from './model/geometry'

const BRUSH = { alpha: 1, color: 'white', width: 4 } as const
const COLORS = ['#ff0000', '#ffee00', '#ffcc00', '#00ff00', '#1e90ff', '#0000cd', '#9900ff']
const SIDES = [3, 4, 5, 6, 7, 8]
const SCALAR = 0.1 as const
const COUNT = 25 as const

export function App(): ReactElement {
  const { width, height } = useWindowSize()

  const random = useMemo(() => makeTwister(Math.random()), [])

  const { points: initial, radius } = useMemo(() => makePositions({ width, height, count: COUNT }), [width, height])
  const drawShapes = useMemo(() => makeShapes({ brush: BRUSH, colors: COLORS, radius, random, sides: SIDES, count: COUNT }), [width, height])

  const [points, setPoints] = useState(initial)

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [target, setTarget] = useState<Point | null>(null)

  useShapesDrag({ points, radius, setPoints, setTarget })

  useEffect(() => {
    iterate()

    function iterate(): void {
      setPoints(inputs => {
        const { isForceApplied, points } = pushApart({ points: inputs, radius, width, height, scalar: SCALAR })
        if (isForceApplied) {
          requestAnimationFrame(iterate)
        }
        return points
      })
    }
  }, [radius, width, height])

  useEffect(() => {
    const context = canvas?.getContext('2d')
    if (context) {
      context.clearRect(0, 0, width, height)
      drawShapes({ context, points, target })
    }
  }, [canvas, drawShapes, points, target])

  return (
    <Fragment>
      <canvas ref={setCanvas} width={width} height={height} className="layer" />
      <div className="layer">
        <div className="overlay">Hello Playground</div>
      </div>
    </Fragment>
  )
}

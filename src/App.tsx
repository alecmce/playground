import { Button } from '@mui/material'
import { Fragment, ReactElement, useCallback, useMemo, useState } from 'react'
import './App.css'
import { useAppState } from './lib/app-state'
import { clampCreatures } from './lib/clamp-point'
import { makeCreatures } from './lib/creatures'
import { makeTwister } from './lib/mersenne-twister'
import { makePieChart } from './lib/piechart'
import { makePushApart } from './lib/push-apart'
import { useCreaturesDrag } from './lib/use-creatures-drag'
import { useRadius } from './lib/use-radius'
import { useTick } from './lib/use-tick'
import { useWindowSize } from './lib/use-window-size'
import { STATE_TYPE, State, iterate, triggerPie } from './model/app-state'
import { CATEGORY, Creature } from './model/creatures'
import { Point } from './model/geometry'
import { PieChart } from './model/piechart'
import { PushApart } from './model/push-apart'
import { Size } from './model/values'

const BRUSH = { alpha: 1, color: 'black', width: 3 } as const
const COLORS = ['#ff0000', '#ffa500', '#ffee00', '#00ff00', '#1e90ff', '#0000cd', '#9900ff']
const SIDES = [3, 4, 5, 6, 7, 8]
const EYES = [1, 2, 3, 4, 5] as Array<1 | 2 | 3 | 4 | 5>
const SCALAR = 0.01 as const
const COUNT = 25 as const
const DENSITY = 0.5 as const

export function App(): ReactElement {
  const size = useWindowSize()
  const { width, height } = size

  // const [gotoRing, setGotoRing] = useState<boolean>(false)
  const [, setVersion] = useState<number>(0)
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [target, setTarget] = useState<Creature | null>(null)
  const [state, dispatchAppState] = useAppState()
  // const [scale, setScale] = useState<number>(1)

  const random = useMemo(() => makeTwister(Math.random()), [])

  const radius = useRadius({ count: COUNT, density: DENSITY, size })
  const creatures = useMemo(() => makeCreatures({ brush: BRUSH, colors: COLORS, count: COUNT, eyes: EYES, radius, random, sides: SIDES, size }), [])
  const pushApart = useMemo(() => makePushApart(creatures), [])
  const pieChart = useMemo(() => makePieChart({ count: COUNT, creatures, radius, size }), [])

  const [pointer, setPointer] = useState<Point | null>(null)

  useCreaturesDrag({ creatures, setPointer, setTarget })


  const tick = useCallback((deltaTime: number) => {
    dispatchAppState(iterate(deltaTime))
    setVersion(version => version + 1)
  }, [setVersion])

  useTick(tick)

  const context = canvas?.getContext('2d')
  if (context) {
    draw({ context, creatures, pieChart, pushApart, pointer, radius, size, state, target })
  }

  return (
    <Fragment>
      <canvas ref={setCanvas} width={width} height={height} className="layer" />
      <div className="layer">
        <div className="overlay">
          <Button variant='contained' color='primary' onClick={onTest}>Test</Button>
        </div>
      </div>
    </Fragment>
  )

  function onTest(): void {
    pieChart.init([CATEGORY.COLOR])
    dispatchAppState(triggerPie())
  }
}

interface DrawProps {
  context:   CanvasRenderingContext2D
  creatures: Creature[]
  pieChart:  PieChart
  pushApart: PushApart
  pointer:   Point | null
  radius:    number
  size:      Size
  state:     State
  target:    Creature | null
}

function draw(props: DrawProps): void {
  const { context, creatures, pieChart, pointer, pushApart, radius, size, state, target } = props
  const { width, height } = size
  const { type, time, duration } = state

  context.clearRect(0, 0, width, height)

  switch (type) {
    case STATE_TYPE.FREE:              return drawFree()
    case STATE_TYPE.ENTER_PIE:         return drawEnterPie(time / duration)
    case STATE_TYPE.ENTER_OVERLAY_PIE: return drawEnterPieOverlay(time / duration)
    case STATE_TYPE.PIE_OVERLAID:      return drawPieOverlaid()
    case STATE_TYPE.EXIT_OVERLAY_PIE:  return drawExitPieOverlay(time / duration)
    case STATE_TYPE.EXIT_PIE:          return drawExitPie(time / duration)
  }

  function drawFree(): void {
    pieChart.reset()
    pushApart({ radius, scalar: SCALAR })
    clampCreatures({ creatures, radius, size })
    drawCommon()
  }

  function drawEnterPie(proportion: number): void {
    pieChart.update(proportion)
    drawPieSpaces(proportion)
    drawCommon(1 + (pieChart.scale - 1) * proportion)
  }

  function drawEnterPieOverlay(proportion: number): void {
    drawPieSpaces(1)
    drawCommon(pieChart.scale)
    drawPie(proportion)
  }

  function drawPieOverlaid(): void {
    const { scale } = pieChart
    drawCommon(scale)
    drawPie(1)
  }

  function drawExitPieOverlay(proportion: number): void {
    pieChart.update(proportion)
    drawPie(proportion)
    drawCommon(pieChart.scale)
    drawPieSpaces(1)
  }

  function drawExitPie(proportion: number): void {
    pieChart.update(1 - proportion)
    drawPieSpaces(1 - proportion)
    drawCommon(1 + (pieChart.scale - 1) * (1 - proportion))
  }

  function drawCommon(scale = 1): void {
    clampCreatures({ creatures, radius, scale, size })
    creatures.forEach(creature => creature.draw({ context, pointer, scale, target }))
  }

  function drawPieSpaces(alpha: number): void {
    pieChart.drawSpaces({ context, brush: { alpha, color: 'grey', width: 2 } })
  }

  function drawPie(alpha: number): void {
    pieChart.drawPie({ context, alpha, brush: { alpha, color: 'grey', width: 2 } })
  }

}

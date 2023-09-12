import { Fragment, ReactElement, useCallback, useMemo, useState } from 'react'
import './App.css'
import { Ui } from './components/UI'
import { useAppState } from './lib/app-state'
import { makeBarChart } from './lib/bar-chart/bar-chart'
import { clampCreatures } from './lib/clamp-point'
import { makeCreatures } from './lib/creatures'
import { quadIn, quadInOut, quadOut } from './lib/ease'
import { makeTwister } from './lib/mersenne-twister'
import { makePieChart } from './lib/pie-chart'
import { makePushApart } from './lib/push-apart'
import { useCreaturesDrag } from './lib/use-creatures-drag'
import { useRadius } from './lib/use-radius'
import { useTick } from './lib/use-tick'
import { useWindowSize } from './lib/use-window-size'
import { AppState, CHART_TYPE, STATE_TYPE, iterate } from './model/app-state'
import { Chart } from './model/charts'
import { Creature } from './model/creatures'
import { Point } from './model/geometry'
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
  const size = useWindowSize({ marginBottom: 100 })
  const { width, height } = size

  const bounds = useMemo(() => ({ left: 30, top: 30, right: width - 60, bottom: height - 60 }), [width, height])

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [target, setTarget] = useState<Creature | null>(null)
  const [state, dispatchAppState] = useAppState()

  const random = useMemo(() => makeTwister(Math.random()), [])

  const radius = useRadius({ count: COUNT, density: DENSITY, size })
  const creatures = useMemo(() => makeCreatures({ brush: BRUSH, colors: COLORS, count: COUNT, eyes: EYES, radius, random, sides: SIDES, size }), [])
  const pushApart = useMemo(() => makePushApart(creatures), [])
  const barChart = useMemo(() => makeBarChart({ bounds, creatures, radius }), [bounds, creatures])
  const pieChart = useMemo(() => makePieChart({ count: COUNT, creatures, radius, size }), [creatures, radius, size])

  const [pointer, setPointer] = useState<Point | null>(null)

  useCreaturesDrag({ creatures, setPointer, setTarget })

  const tick = useCallback((deltaTime: number) => {
    dispatchAppState(iterate(deltaTime))
  }, [dispatchAppState])

  useTick(tick)

  const context = canvas?.getContext('2d')
  if (context) {
    draw({ context, creatures, barChart, pieChart, pushApart, pointer, radius, size, state, target })
  }

  return (
    <Fragment>
      <div className="layer">
        <canvas ref={setCanvas} width={width} height={height} style={{ width, height }}/>
      </div>
      <Ui barChart={barChart} pieChart={pieChart} state={state} dispatchAppState={dispatchAppState} />
    </Fragment>
  )
}

interface DrawProps {
  context:   CanvasRenderingContext2D
  creatures: Creature[]
  barChart:  Chart
  pieChart:  Chart
  pushApart: PushApart
  pointer:   Point | null
  radius:    number
  size:      Size
  state:     AppState
  target:    Creature | null
}

function draw(props: DrawProps): void {
  const { context, creatures, barChart, pieChart, pointer, pushApart, radius, size, state, target } = props
  const { width, height } = size
  const { type, time, duration } = state

  context.clearRect(0, 0, width, height)

  switch (type) {
    case STATE_TYPE.FREE:             return drawFree()
    case STATE_TYPE.BAR_CHART_CONFIG: return drawFree()
    case STATE_TYPE.PIE_CHART_CONFIG: return drawFree()
    case STATE_TYPE.ENTER_PLACES:     return drawEnterChart(getChart(state.chart)!, quadInOut(time / duration))
    case STATE_TYPE.ENTER_OVERLAY:    return drawEnterChartOverlay(getChart(state.chart)!, quadOut(time / duration))
    case STATE_TYPE.FULL_OVERLAY:     return drawChartOverlay(getChart(state.chart)!, )
    case STATE_TYPE.EXIT_OVERLAY:     return drawExitChartOverlay(getChart(state.chart)!, quadIn(time / duration))
    case STATE_TYPE.LEAVE_PLACES:     return drawExitChart(getChart(state.chart)!, quadInOut(time / duration))
    case STATE_TYPE.CLOSE_CHART:      return drawExitChart(getChart(state.chart)!, quadInOut(time / duration))
  }

  function drawFree(): void {
    barChart.reset()
    pieChart.reset()
    pushApart({ radius, scalar: SCALAR })
    clampCreatures({ creatures, radius, size })
    drawCommon()
  }

  function drawEnterChart(chart: Chart, proportion: number): void {
    chart.update(proportion)
    drawChartBackground(chart, proportion)
    drawCommon(1 + (chart.getScale() - 1) * proportion)
  }

  function drawEnterChartOverlay(chart: Chart, proportion: number): void {
    drawChartBackground(chart, 1)
    drawCommon(chart.getScale())
    drawChart(chart, proportion)
  }

  function drawChartOverlay(chart: Chart): void {
    drawCommon(chart.getScale())
    drawChart(chart, 1)
  }

  function drawExitChartOverlay(chart: Chart, proportion: number): void {
    drawChartBackground(chart, 1)
    drawCommon(chart.getScale())
    drawChart(chart, 1 - proportion)
  }

  function drawExitChart(chart: Chart, proportion: number): void {
    chart.update(1 - proportion)
    drawChartBackground(chart, 1 - proportion)
    drawCommon(1 + (chart.getScale() - 1) * (1 - proportion))
  }

  function getChart(chart: CHART_TYPE | undefined): Chart | undefined {
    switch (chart) {
      case CHART_TYPE.BAR_CHART: return barChart
      case CHART_TYPE.PIE_CHART: return pieChart
      default:                   return undefined
    }
  }

  function drawCommon(scale = 1): void {
    clampCreatures({ creatures, radius, scale, size })
    creatures.forEach(creature => creature.draw({ context, pointer, scale, target }))
  }

  function drawChartBackground(chart: Chart, alpha: number): void {
    chart.drawBackground({ context, brush: { alpha, color: 'grey', width: 2 } })
  }

  function drawChart(chart: Chart, alpha: number): void {
    chart.drawMain({ context, alpha, brush: { alpha, color: 'black', width: 2 } })
  }

}

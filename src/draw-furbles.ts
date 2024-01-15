import { clampCreatures } from './lib/clamp-creatures'
import { quadIn, quadInOut, quadOut } from './lib/ease'
import { CHART_TYPE, STATE_TYPE } from './model/app-state'
import { CategorisationChart, Chart, SetInclusionChart } from './model/charts'
import { Creature } from './model/creatures'
import { DrawFurblesProps, DrawingApi } from './model/drawing'
import { PushApart } from './model/push-apart'
import { Puzzle } from './model/puzzle'

const SCALAR = 0.01 as const

interface Props extends DrawFurblesProps {
  barChart:       CategorisationChart | undefined
  carrollDiagram: SetInclusionChart | undefined
  creatures:      Creature[] | undefined
  drawingApi:     DrawingApi
  pieChart:       CategorisationChart | undefined
  pushApart:      PushApart | undefined
  puzzle:         Puzzle | null
  vennDiagram:    SetInclusionChart | undefined
}

export function drawFurbles(props: Props): void {
  const {
    barChart, carrollDiagram, creatures, drawingApi, pieChart, pointer, pushApart, puzzle, radius, size, state, target,
    vennDiagram,
  } = props
  const { clear } = drawingApi
  const { chart: chartType, type, time, duration } = state
  const chart = getChart(chartType)

  clear(size)


  const p = time / duration
  switch (type) {
    case STATE_TYPE.CLOSE_CHART:      return chart ? drawExitChart(chart, quadInOut(p)) : drawFree()
    case STATE_TYPE.ENTER_OVERLAY:    return chart ? drawEnterChartOverlay(chart, quadOut(p)) : drawFree()
    case STATE_TYPE.ENTER_PLACES:     return chart ? drawEnterChart(chart, quadInOut(p)) : drawFree()
    case STATE_TYPE.EXIT_OVERLAY:     return chart ? drawExitChartOverlay(chart, quadIn(p)) : drawFree()
    case STATE_TYPE.FREE:             return drawFree()
    case STATE_TYPE.FULL_OVERLAY:     return chart ? drawChartOverlay(chart) : drawFree()
    case STATE_TYPE.LEAVE_PLACES:     return chart ? drawExitChart(chart, quadInOut(p)) : drawFree()
    case STATE_TYPE.ENTER_PUZZLE:     return puzzle ? puzzle.drawEnter(props, p) : drawFree()
    case STATE_TYPE.PUZZLE_MAIN:      return puzzle ? puzzle.drawMain(props) : drawFree()
    case STATE_TYPE.EXIT_PUZZLE:      return puzzle ? puzzle.drawExit(props, p) : drawFree()
    default:                          return drawFree()
  }

  function drawFree(): void {
    barChart?.reset()
    pieChart?.reset()
    pushApart?.({ radius, scalar: SCALAR })
    clampCreatures({ creatures, radius, size })
    drawCommon()
  }

  function drawEnterChart(chart: Chart<any>, proportion: number): void {
    chart.update(proportion)
    drawChartBackground(chart, proportion)
    drawCommon(1 + (chart.getScale() - 1) * proportion)
  }

  function drawEnterChartOverlay(chart: Chart<any>, proportion: number): void {
    chart.update(1)
    drawChartBackground(chart, 1)
    drawCommon(chart.getScale())
    drawChart(chart, proportion)
  }

  function drawChartOverlay(chart: Chart<any>): void {
    chart.update(1)
    drawCommon(chart.getScale())
    drawChart(chart, 1)
  }

  function drawExitChartOverlay(chart: Chart<any>, proportion: number): void {
    chart.update(1)
    drawChartBackground(chart, 1)
    drawCommon(chart.getScale())
    drawChart(chart, 1 - proportion)
  }

  function drawExitChart(chart: Chart<any>, proportion: number): void {
    chart.update(1 - proportion)
    drawChartBackground(chart, 1 - proportion)
    drawCommon(1 + (chart.getScale() - 1) * (1 - proportion))
  }

  function getChart(chart: CHART_TYPE | undefined): Chart<any> | undefined {
    switch (chart) {
      case CHART_TYPE.BAR_CHART:       return barChart
      case CHART_TYPE.PIE_CHART:       return pieChart
      case CHART_TYPE.CARROLL_DIAGRAM: return carrollDiagram
      case CHART_TYPE.VENN_DIAGRAM:    return vennDiagram
      default:                         return undefined
    }
  }

  function drawCommon(scale = 1): void {
    clampCreatures({ creatures, radius, scale, size })
    creatures?.forEach(creature => creature.draw({ pointer, scale, target }))
  }

  function drawChartBackground(chart: Chart<any>, alpha: number): void {
    chart.drawBackground({ brush: { alpha, color: 'grey', width: 2 } })
  }

  function drawChart(chart: Chart<any>, alpha: number): void {
    chart.drawMain({ alpha, brush: { alpha, color: 'black', width: 2 } })
  }
}

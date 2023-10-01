import { clampCreatures } from './lib/clamp-creatures'
import { quadIn, quadInOut, quadOut } from './lib/ease'
import { AppState, CHART_TYPE, STATE_TYPE } from './model/app-state'
import { CategorisationChart, Chart, SetInclusionChart } from './model/charts'
import { Creature } from './model/creatures'
import { DrawingApi } from './model/drawing'
import { Point } from './model/geometry'
import { PushApart } from './model/push-apart'
import { Size } from './model/values'

const SCALAR = 0.01 as const

interface Props {
  barChart:       CategorisationChart | undefined
  carrollDiagram: SetInclusionChart | undefined
  creatures:      Creature[] | undefined
  drawingApi:     DrawingApi | undefined
  pieChart:       CategorisationChart | undefined
  pointer:        Point | null
  pushApart:      PushApart | undefined
  radius:         number
  size:           Size
  state:          AppState
  target:         Creature | null
}

interface Defined {
  drawingApi:     DrawingApi
  creatures:      Creature[]
  barChart:       CategorisationChart
  pieChart:       CategorisationChart
  carrollDiagram: SetInclusionChart
  pushApart:      PushApart
}


export function draw(props: Props): void {
  const { barChart, carrollDiagram, creatures, drawingApi, pieChart, pointer, pushApart, radius, size, state, target } = props

  if (barChart && carrollDiagram && creatures && drawingApi && pieChart && pushApart) {
    draw({ carrollDiagram, barChart, creatures, drawingApi, pieChart, pushApart })
  }

  function draw(defined: Defined): void {
    const { barChart, carrollDiagram, creatures, drawingApi, pieChart, pushApart } = defined

    const { clear } = drawingApi
    const { chart: chartType, type, time, duration } = state
    const chart = getChart(chartType)

    clear(size)
    chart ? applyChartState(chart) : drawFree()

    function applyChartState(chart: Chart<any>): void {
      const p = time / duration
      switch (type) {
        case STATE_TYPE.BAR_CHART_CONFIG: return drawFree()
        case STATE_TYPE.CLOSE_CHART:      return drawExitChart(chart, quadInOut(p))
        case STATE_TYPE.ENTER_OVERLAY:    return drawEnterChartOverlay(chart, quadOut(p))
        case STATE_TYPE.ENTER_PLACES:     return drawEnterChart(chart, quadInOut(p))
        case STATE_TYPE.EXIT_OVERLAY:     return drawExitChartOverlay(chart, quadIn(p))
        case STATE_TYPE.FREE:             return drawFree()
        case STATE_TYPE.FULL_OVERLAY:     return drawChartOverlay(chart, )
        case STATE_TYPE.LEAVE_PLACES:     return drawExitChart(chart, quadInOut(p))
        case STATE_TYPE.PIE_CHART_CONFIG: return drawFree()
      }
    }

    function drawFree(): void {
      barChart.reset()
      pieChart.reset()
      pushApart({ radius, scalar: SCALAR })
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
        default:                         return undefined
      }
    }

    function drawCommon(scale = 1): void {
      clampCreatures({ creatures, radius, scale, size })
      creatures.forEach(creature => creature.draw({ pointer, scale, target }))
    }

    function drawChartBackground(chart: Chart<any>, alpha: number): void {
      chart.drawBackground({ brush: { alpha, color: 'grey', width: 2 } })
    }

    function drawChart(chart: Chart<any>, alpha: number): void {
      chart.drawMain({ alpha, brush: { alpha, color: 'black', width: 2 } })
    }
  }

}

import { useMemo } from 'react'
import { clampCreatures } from './lib/clamp-creatures'
import { quadIn, quadInOut, quadOut } from './lib/ease'
import { AppState, CHART_TYPE, STATE_TYPE } from './model/app-state'
import { CategorisationChart, Chart, SetInclusionChart } from './model/charts'
import { Creature } from './model/creatures'
import { DrawingApi } from './model/drawing'
import { Point } from './model/geometry'
import { PushApart } from './model/push-apart'
import { Size } from './model/values'
import { Optional } from './types'

const SCALAR = 0.01 as const

interface Props {
  barChart:       CategorisationChart
  carrollDiagram: SetInclusionChart
  creatures:      Creature[]
  drawingApi:     DrawingApi
  pieChart:       CategorisationChart
  pushApart:      PushApart
  vennDiagram:    SetInclusionChart
}

interface DrawFurblesProps {
  pointer: Point | null
  radius:  number
  size:    Size
  state:   AppState
  target:  Creature | null
}

interface DrawFurbles {
  (props: DrawFurblesProps): void
}

export function useDrawFurbles(props: Optional<Props>): DrawFurbles | undefined {
  const { barChart, carrollDiagram, creatures, drawingApi, pieChart, pushApart, vennDiagram } = props

  return useMemo(() => {
    return barChart && carrollDiagram && creatures && drawingApi && pieChart && pushApart && vennDiagram
      ? makeDrawFurbles({ barChart, carrollDiagram, creatures, drawingApi, pieChart, pushApart, vennDiagram })
      : undefined
  }, [barChart, carrollDiagram, creatures, drawingApi, pieChart, pushApart, vennDiagram])
}

function makeDrawFurbles(props: Props): DrawFurbles {
  const { barChart, carrollDiagram, creatures, drawingApi, pieChart, pushApart, vennDiagram } = props

  return function draw(props: DrawFurblesProps): void {
    const { pointer, radius, size, state, target } = props
    const { clear } = drawingApi
    const { chart: chartType, type, time, duration } = state
    const chart = getChart(chartType)

    clear(size)

    chart ? applyChartState(chart) : drawFree()

    function applyChartState(chart: Chart<any>): void {
      const p = time / duration
      switch (type) {
        case STATE_TYPE.CLOSE_CHART:      return drawExitChart(chart, quadInOut(p))
        case STATE_TYPE.ENTER_OVERLAY:    return drawEnterChartOverlay(chart, quadOut(p))
        case STATE_TYPE.ENTER_PLACES:     return drawEnterChart(chart, quadInOut(p))
        case STATE_TYPE.EXIT_OVERLAY:     return drawExitChartOverlay(chart, quadIn(p))
        case STATE_TYPE.FREE:             return drawFree()
        case STATE_TYPE.FULL_OVERLAY:     return drawChartOverlay(chart, )
        case STATE_TYPE.LEAVE_PLACES:     return drawExitChart(chart, quadInOut(p))
        default:                          return drawFree()
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
        case CHART_TYPE.VENN_DIAGRAM:    return vennDiagram
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

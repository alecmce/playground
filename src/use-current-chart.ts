import { useMemo } from 'react'
import { CHART_TYPE } from './model/app-state'
import { CategorisationChart, Chart, SetInclusionChart } from './model/charts'

interface Props {
  barChart:       CategorisationChart | undefined
  carrollDiagram: SetInclusionChart | undefined
  pieChart:       CategorisationChart | undefined
  type:           CHART_TYPE | undefined
}

export function useCurrentChart(props: Props): Chart<any> | undefined {
  const { barChart, carrollDiagram, pieChart, type } = props

  return useMemo(() => {
    switch (type) {
      case CHART_TYPE.BAR_CHART:       return barChart
      case CHART_TYPE.CARROLL_DIAGRAM: return carrollDiagram
      case CHART_TYPE.PIE_CHART:       return pieChart
      default:                         return undefined
    }
  }, [barChart, carrollDiagram, pieChart, type])
}

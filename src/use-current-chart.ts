import { useMemo } from 'react'
import { CHART_TYPE } from './model/app-state'
import { Chart } from './model/charts'

interface Props {
  barChart: Chart
  pieChart: Chart
  type:     CHART_TYPE | undefined
}

export function useCurrentChart(props: Props): Chart | undefined {
  const { barChart, pieChart, type } = props

  return useMemo(() => {
    switch (type) {
      case CHART_TYPE.BAR_CHART: return barChart
      case CHART_TYPE.PIE_CHART: return pieChart
      default:                   return undefined
    }
  }, [barChart, pieChart, type])
}

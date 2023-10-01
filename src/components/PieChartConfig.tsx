import { ReactElement, useState } from 'react'

import { AppStateAction, CHART_TYPE, STATE_TYPE, jump } from 'src/model/app-state'
import { CategorisationChart } from 'src/model/charts'
import { CATEGORY } from 'src/model/creatures'
import { CategoryOptions } from './CategoryOptions'


interface Props {
  pieChart:         CategorisationChart
  dispatchAppState: (action: AppStateAction) => void
}

export function PieChartConfig(props: Props): ReactElement {
  const { pieChart, dispatchAppState } = props
  const [categories, setCategories] = useState<Set<CATEGORY>>(new Set([CATEGORY.COLOR]))

  return (
    <CategoryOptions aria-label="pie-chart" categories={categories} setCategories={setCategories} onClick={onClick} />
  )

  function onClick(): void {
    pieChart.init(Array.from(categories))
    dispatchAppState(jump({ chart: CHART_TYPE.PIE_CHART, type: STATE_TYPE.ENTER_PLACES, time: 0 }))
  }
}

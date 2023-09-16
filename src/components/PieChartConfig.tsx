import { Fragment, ReactElement, useState } from 'react'

import PlayArrow from '@mui/icons-material/PlayArrow'
import { AppStateAction, CHART_TYPE, STATE_TYPE, jump } from 'src/model/app-state'
import { Chart } from 'src/model/charts'
import { CATEGORY } from 'src/model/creatures'
import { CategoryOptions } from './CategoryOptions'


interface Props {
  pieChart:         Chart
  dispatchAppState: (action: AppStateAction) => void
}

export function PieChartConfig(props: Props): ReactElement {
  const { pieChart, dispatchAppState } = props
  const [categories, setCategories] = useState<Set<CATEGORY>>(new Set([CATEGORY.COLOR]))

  return (
    <Fragment>
      <CategoryOptions aria-label="pie-chart" categories={categories} setCategories={setCategories} onClick={onClick}>
        <PlayArrow />
      </CategoryOptions>
    </Fragment>
  )

  function onClick(): void {
    pieChart.init(Array.from(categories))
    dispatchAppState(jump({ chart: CHART_TYPE.PIE_CHART, type: STATE_TYPE.ENTER_PLACES, time: 0 }))
  }
}

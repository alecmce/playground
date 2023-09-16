import { Fragment, ReactElement, useState } from 'react'

import PlayArrow from '@mui/icons-material/PlayArrow'
import { AppStateAction, CHART_TYPE, STATE_TYPE, jump } from 'src/model/app-state'
import { Chart } from 'src/model/charts'
import { CATEGORY } from 'src/model/creatures'
import { CategoryOptions } from './CategoryOptions'


interface Props {
  barChart:         Chart
  dispatchAppState: (action: AppStateAction) => void
}

export function BarChartConfig(props: Props): ReactElement {
  const { barChart, dispatchAppState } = props
  const [categories, setCategories] = useState<Set<CATEGORY>>(new Set([CATEGORY.COLOR]))

  return (
    <Fragment>
      <CategoryOptions aria-label="bar-chart" categories={categories} setCategories={setCategories} onClick={onClick}>
        <PlayArrow />
      </CategoryOptions>
    </Fragment>
  )

  function onClick(): void {
    barChart.init(Array.from(categories))
    dispatchAppState(jump({ chart: CHART_TYPE.BAR_CHART, type: STATE_TYPE.ENTER_PLACES, time: 0 }))
  }
}

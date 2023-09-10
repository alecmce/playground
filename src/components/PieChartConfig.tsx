import { IconButton } from '@mui/material'
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
      <CategoryOptions categories={categories} setCategories={setCategories} />
      <IconButton aria-label="pie-chart" size="large" onClick={onClick}>
        <PlayArrow />
      </IconButton>
    </Fragment>
  )

  function onClick(): void {
    pieChart.init(Array.from(categories))
    dispatchAppState(jump({ chart: CHART_TYPE.PIE_CHART, type: STATE_TYPE.ENTER_PLACES, time: 0 }))
  }
}

import { ReactElement, useState } from 'react'

import { Stack } from '@mui/joy'
import { AppStateAction, CHART_TYPE, STATE_TYPE, jump } from 'src/model/app-state'
import { CategorisationChart } from 'src/model/charts'
import { CATEGORY } from 'src/model/creatures'
import { CategoryOptions } from './CategoryOptions'
import { CloseButton } from './CloseButton'
import { PieChartIcon } from './Icons'


interface Props {
  pieChart:         CategorisationChart
  dispatchAppState: (action: AppStateAction) => void
}

export function PieChartConfig(props: Props): ReactElement {
  const { pieChart, dispatchAppState } = props
  const [categories, setCategories] = useState<Set<CATEGORY>>(new Set([CATEGORY.COLOR]))

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center', alignItems: 'center' }}>
      <PieChartIcon />
      <CloseButton dispatchAppState={dispatchAppState} />
      <CategoryOptions aria-label="pie-chart" categories={categories} setCategories={setCategories} onClick={onClick} />
    </Stack>
  )

  function onClick(): void {
    pieChart.init(Array.from(categories))
    dispatchAppState(jump({ chart: CHART_TYPE.PIE_CHART, type: STATE_TYPE.ENTER_PLACES, time: 0 }))
  }
}

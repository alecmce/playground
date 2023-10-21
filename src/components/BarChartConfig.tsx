import { ReactElement, useState } from 'react'

import { Stack } from '@mui/joy'
import { AppStateAction, CHART_TYPE, STATE_TYPE, jump } from 'src/model/app-state'
import { CategorisationChart } from 'src/model/charts'
import { CATEGORY } from 'src/model/creatures'
import { CategoryOptions } from './CategoryOptions'
import { CloseButton } from './CloseButton'
import { BarChartIcon } from './Icons'


interface Props {
  barChart:         CategorisationChart
  dispatchAppState: (action: AppStateAction) => void
}

export function BarChartConfig(props: Props): ReactElement {
  const { barChart, dispatchAppState } = props
  const [categories, setCategories] = useState<Set<CATEGORY>>(new Set([CATEGORY.COLOR]))

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center', alignItems: 'center' }}>
      <CloseButton onClose={onClose} />
      <BarChartIcon color="info" />
      <CategoryOptions aria-label="bar-chart" categories={categories} setCategories={setCategories} onClick={onClick} />
    </Stack>
  )

  function onClose(): void {
    dispatchAppState(jump({ type: STATE_TYPE.FREE, time: 0 }))
  }

  function onClick(): void {
    barChart.init(Array.from(categories))
    dispatchAppState(jump({ chart: CHART_TYPE.BAR_CHART, type: STATE_TYPE.ENTER_PLACES, time: 0 }))
  }
}

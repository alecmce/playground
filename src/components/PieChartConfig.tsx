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
  const [categories, setCategories] = useState<CATEGORY[]>([CATEGORY.COLOR])

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center', alignItems: 'center' }}>
      <CloseButton onClose={onClose} />
      <PieChartIcon color="warning" />
      <CategoryOptions
        aria-label="pie-chart"
        categories={categories}
        setCategories={wrappedSetCategories}
        onClick={onClick}
      />
    </Stack>
  )

  function wrappedSetCategories(newCategories: CATEGORY[]): void {
    setCategories(newCategories.length ? newCategories : [CATEGORY.COLOR])
  }

  function onClose(): void {
    dispatchAppState(jump({ type: STATE_TYPE.FREE, time: 0 }))
  }

  function onClick(): void {
    pieChart.init(Array.from(categories))
    dispatchAppState(jump({ chart: CHART_TYPE.PIE_CHART, type: STATE_TYPE.ENTER_PLACES, time: 0 }))
  }
}

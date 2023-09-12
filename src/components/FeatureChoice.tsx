import { Button, Stack } from '@mui/material'
import { ReactElement } from 'react'

import BarChart from '@mui/icons-material/BarChart'
import PieChart from '@mui/icons-material/PieChart'
import { AppStateAction, STATE_TYPE, jump } from 'src/model/app-state'


interface Props {
  dispatchAppState: (action: AppStateAction) => void
  disabled?:        true
}

export function FeatureChoice(props: Props): ReactElement {
  const { dispatchAppState, disabled } = props

  return (
    <Stack spacing={2} direction="row">
      <Button
        aria-label="bar-chart"
        color="primary"
        disabled={disabled}
        onClick={selectBarChart}
        size="large"
        startIcon={<BarChart />}
        variant="contained"
      >
        Bar Chart
      </Button>
      <Button
        aria-label="pie-chart"
        color="primary"
        disabled={disabled}
        onClick={selectPieChart}
        size="large"
        startIcon={<PieChart />}
        variant="contained"
      >
        Pie Chart
      </Button>
    </Stack>
  )

  function selectBarChart(): void {
    dispatchAppState(jump({ type: STATE_TYPE.BAR_CHART_CONFIG, time: 0 }))
  }

  function selectPieChart(): void {
    dispatchAppState(jump({ type: STATE_TYPE.PIE_CHART_CONFIG, time: 0 }))
  }
}

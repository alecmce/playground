import { Button } from '@mui/material'
import { Fragment, ReactElement } from 'react'

import PieChart from '@mui/icons-material/PieChart'
import { AppStateAction, STATE_TYPE, jump } from 'src/model/app-state'


interface Props {
  dispatchAppState: (action: AppStateAction) => void
  disabled?:        true
}

export function FeatureChoice(props: Props): ReactElement {
  const { dispatchAppState, disabled } = props

  return (
    <Fragment>
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
    </Fragment>
  )

  function selectPieChart(): void {
    dispatchAppState(jump({ type: STATE_TYPE.PIE_CHART_CONFIG, time: 0 }))
  }

}

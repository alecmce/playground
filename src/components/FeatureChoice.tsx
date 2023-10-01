import { Button, Stack } from '@mui/material'
import { ReactElement, memo } from 'react'

import BarChart from '@mui/icons-material/BarChart'
import GridViewIcon from '@mui/icons-material/GridView'
import Groups3Icon from '@mui/icons-material/Groups3'
import PieChart from '@mui/icons-material/PieChart'
import { AppStateAction, STATE_TYPE, jump } from 'src/model/app-state'

interface Props {
  disabled?:        true
  dispatchAppState: (action: AppStateAction) => void
  setShowDialog:    (showDialog: boolean) => void
}

export const FeatureChoice = memo(Component)

function Component(props: Props): ReactElement {
  const { disabled, dispatchAppState, setShowDialog } = props

  return (
    <Stack spacing={2} direction="row" sx={{mb: 0, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        aria-label="setup population"
        color="primary"
        onClick={onPopulationToggle}
        size="large"
        startIcon={<Groups3Icon />}
        variant="contained"
      >
          Population
      </Button>
      <Button
        aria-label="bar chart"
        color="secondary"
        disabled={disabled}
        onClick={selectBarChart}
        size="large"
        startIcon={<BarChart />}
        variant="contained"
      >
        Bar Chart
      </Button>
      <Button
        aria-label="pie chart"
        color="secondary"
        disabled={disabled}
        onClick={selectPieChart}
        size="large"
        startIcon={<PieChart />}
        variant="contained"
      >
        Pie Chart
      </Button>
      <Button
        aria-label="carroll diagram"
        color="secondary"
        disabled={disabled}
        onClick={selectCarrollDiagram}
        size="large"
        startIcon={<GridViewIcon />}
        variant="contained"
      >
        Carroll Diagram
      </Button>
    </Stack>
  )

  function onPopulationToggle(): void {
    setShowDialog(true)
  }

  function selectBarChart(): void {
    dispatchAppState(jump({ type: STATE_TYPE.BAR_CHART_CONFIG, time: 0 }))
  }

  function selectPieChart(): void {
    dispatchAppState(jump({ type: STATE_TYPE.PIE_CHART_CONFIG, time: 0 }))
  }

  function selectCarrollDiagram(): void {
    dispatchAppState(jump({ type: STATE_TYPE.CARROLL_DIAGRAM_CONFIG, time: 0 }))
  }
}

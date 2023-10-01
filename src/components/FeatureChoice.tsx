import { Button, IconButton, Stack } from '@mui/material'
import { Dispatch, Fragment, ReactElement, SetStateAction, memo } from 'react'

import BarChart from '@mui/icons-material/BarChart'
import Groups3Icon from '@mui/icons-material/Groups3'
import PieChart from '@mui/icons-material/PieChart'
import { AppStateAction, STATE_TYPE, jump } from 'src/model/app-state'
import { PopulationModel } from 'src/model/population'
import { NewPopulationDialog } from './NewPopulationDialog'


interface Props {
  disabled?:        true
  dispatchAppState: (action: AppStateAction) => void
  population:       PopulationModel
  setPopulation:    Dispatch<SetStateAction<PopulationModel>>
  setShowDialog:    (showDialog: boolean) => void
  showDialog:       boolean
}

export const FeatureChoice = memo(Component)

function Component(props: Props): ReactElement {
  const { disabled, dispatchAppState, population, setPopulation, setShowDialog, showDialog } = props

  return (
    <Fragment>
      <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center' }}>
        <IconButton
          aria-label="new-population"
          onClick={onPopulationToggle}
          size="large"
          color="secondary"
        >
          <Groups3Icon />
        </IconButton>
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
      { showDialog && (
        <NewPopulationDialog
          population={population}
          setPopulation={setPopulation}
          onClose={() => setShowDialog(false)}
        />
      )}
    </Fragment>
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
}

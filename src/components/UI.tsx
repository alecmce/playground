import { Card, CardContent } from '@mui/material'
import { Dispatch, ReactElement, SetStateAction } from 'react'
import { AppState, AppStateAction, STATE_TYPE } from 'src/model/app-state'
import { Chart } from 'src/model/charts'
import { PopulationModel } from 'src/model/population'
import { BarChartConfig } from './BarChartConfig'
import { ChartSlider } from './ChartSlider'
import { FeatureChoice } from './FeatureChoice'
import { PieChartConfig } from './PieChartConfig'


interface Props {
  barChart:         Chart
  dispatchAppState: (action: AppStateAction) => void
  pieChart:         Chart
  population:       PopulationModel
  setPopulation:    Dispatch<SetStateAction<PopulationModel>>
  setShowDialog:    (showDialog: boolean) => void
  showDialog:       boolean
  state:            AppState
}

export function Ui(props: Props): ReactElement {
  const { barChart, dispatchAppState, pieChart, population, setPopulation, setShowDialog, showDialog, state } = props
  const { type } = state

  return (
    <div className="layer">
      <div className="overlay">
        <Card>
          <CardContent sx={{ width: '100%', '&:last-child': { paddingBottom: 2 }}}>
            { getContents() }
          </CardContent>
        </Card>
      </div>
    </div>
  )

  function getContents(): ReactElement | null {
    switch (type) {
      case STATE_TYPE.FREE:             return getFeatureChoice()
      case STATE_TYPE.BAR_CHART_CONFIG: return <BarChartConfig barChart={barChart} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.PIE_CHART_CONFIG: return <PieChartConfig pieChart={pieChart} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.ENTER_PLACES:     return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.ENTER_OVERLAY:    return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.FULL_OVERLAY:     return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.EXIT_OVERLAY:     return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.LEAVE_PLACES:     return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.CLOSE_CHART:      return getFeatureChoice()
      default:                          return null
    }
  }

  function getFeatureChoice(): ReactElement {
    return (
      <FeatureChoice
        dispatchAppState={dispatchAppState}
        population={population}
        setPopulation={setPopulation}
        setShowDialog={setShowDialog}
        showDialog={showDialog}
      />
    )
  }
}

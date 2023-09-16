import { Card, CardContent } from '@mui/material'
import { ReactElement } from 'react'
import { AppState, AppStateAction, STATE_TYPE } from 'src/model/app-state'
import { Chart } from 'src/model/charts'
import { BarChartConfig } from './BarChartConfig'
import { FeatureChoice } from './FeatureChoice'
import { PieChartConfig } from './PieChartConfig'
import { ChartSlider } from './ChartSlider'


interface Props {
  barChart:         Chart
  pieChart:         Chart
  state:            AppState
  dispatchAppState: (action: AppStateAction) => void
}

export function Ui(props: Props): ReactElement {
  const { barChart, pieChart, state, dispatchAppState } = props
  const { type } = state

  return (
    <div className="layer">
      <div className="overlay">
        <Card>
          <CardContent sx={{ '&:last-child': { paddingBottom: 2 }}}>
            { getContents() }
          </CardContent>
        </Card>
      </div>
    </div>
  )

  function getContents(): ReactElement | null {
    switch (type) {
      case STATE_TYPE.FREE:             return <FeatureChoice dispatchAppState={dispatchAppState} />
      case STATE_TYPE.BAR_CHART_CONFIG: return <BarChartConfig barChart={barChart} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.PIE_CHART_CONFIG: return <PieChartConfig pieChart={pieChart} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.ENTER_PLACES:     return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.ENTER_OVERLAY:    return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.FULL_OVERLAY:     return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.EXIT_OVERLAY:     return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.LEAVE_PLACES:     return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.CLOSE_CHART:      return <FeatureChoice disabled dispatchAppState={dispatchAppState} />
      default:                          return null
    }
  }
}

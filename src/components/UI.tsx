import { Card, CardContent } from '@mui/material'
import { ReactElement } from 'react'
import { AppState, AppStateAction, STATE_TYPE } from 'src/model/app-state'
import { PieChart } from 'src/model/piechart'
import { FeatureChoice } from './FeatureChoice'
import { PieChartConfig } from './PieChartConfig'
import { PiechartSlider } from './PiechartSlider'


interface Props {
  pieChart:         PieChart
  state:            AppState
  dispatchAppState: (action: AppStateAction) => void
}

export function Ui(props: Props): ReactElement {
  const { pieChart, state, dispatchAppState } = props
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
      case STATE_TYPE.FREE:              return <FeatureChoice dispatchAppState={dispatchAppState} />
      case STATE_TYPE.PIE_CHART_CONFIG:  return <PieChartConfig pieChart={pieChart} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.ENTER_PIE:         return <PiechartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.ENTER_OVERLAY_PIE: return <PiechartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.PIE_OVERLAID:      return <PiechartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.EXIT_OVERLAY_PIE:  return <PiechartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.EXIT_PIE:          return <PiechartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.CLOSE_PIE:         return <FeatureChoice disabled dispatchAppState={dispatchAppState} />
      default:                           return null
    }
  }
}

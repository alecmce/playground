import { Box, Card, CardContent } from '@mui/joy'
import { Dispatch, Fragment, ReactElement, SetStateAction } from 'react'
import { AppState, AppStateAction, STATE_TYPE } from 'src/model/app-state'
import { CategorisationChart, SetInclusionChart } from 'src/model/charts'
import { PopulationModel } from 'src/model/population'
import { BarChartConfig } from './BarChartConfig'
import { CarrollDiagramConfig } from './CarrollDiagramConfig'
import { ChartSlider } from './ChartSlider'
import { FeatureChoice } from './FeatureChoice'
import { NewPopulationDialog } from './NewPopulationDialog'
import { PieChartConfig } from './PieChartConfig'
import { VennDiagramConfig } from './VennDiagramConfig'
import { GLASS_SX } from './glass-sx'


interface Props {
  barChart:         CategorisationChart | undefined
  carrollDiagram:   SetInclusionChart | undefined
  dispatchAppState: (action: AppStateAction) => void
  maxCount:         number
  pieChart:         CategorisationChart | undefined
  population:       PopulationModel
  setPopulation:    Dispatch<SetStateAction<PopulationModel>>
  setShowDialog:    (showDialog: boolean) => void
  showDialog:       boolean
  state:            AppState
  vennDiagram:      SetInclusionChart | undefined
}

interface RenderedProps extends Props {
  barChart:         CategorisationChart
  carrollDiagram:   SetInclusionChart
  pieChart:         CategorisationChart
  vennDiagram:      SetInclusionChart
}

export function Ui(props: Props): ReactElement | null {
  const { barChart, carrollDiagram, pieChart, vennDiagram } = props

  return barChart && carrollDiagram && pieChart && vennDiagram
    ? <Component {...props} barChart={barChart} carrollDiagram={carrollDiagram} pieChart={pieChart} vennDiagram={vennDiagram} />
    : null
}

function Component(props: RenderedProps): ReactElement {
  const {
    barChart, carrollDiagram, dispatchAppState, pieChart, population, setPopulation, setShowDialog, showDialog, state,
    maxCount, vennDiagram,
  } = props
  const { type } = state

  return (
    <Box sx={{ position: 'absolute', bottom: 20, display: 'flex', justifyContent: 'center', width: '100%' }}>
      <Card variant="soft" sx={{ '&': GLASS_SX }}>
        <CardContent sx={{
          '&.MuiCardContent-root': { backgroundColor: 'transparent' },
          '&': { backgroundColor: 'transparent' },
        }}>
          { getContents() }
        </CardContent>
      </Card>
    </Box>
  )

  function getContents(): ReactElement | null {
    switch (type) {
      case STATE_TYPE.BAR_CHART_CONFIG:       return <BarChartConfig barChart={barChart} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.CARROLL_DIAGRAM_CONFIG: return <CarrollDiagramConfig diagram={carrollDiagram} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.CLOSE_CHART:            return getFeatureChoice()
      case STATE_TYPE.ENTER_OVERLAY:          return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.ENTER_PLACES:           return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.EXIT_OVERLAY:           return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.FREE:                   return getFeatureChoice()
      case STATE_TYPE.FULL_OVERLAY:           return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.LEAVE_PLACES:           return <ChartSlider state={state} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.PIE_CHART_CONFIG:       return <PieChartConfig pieChart={pieChart} dispatchAppState={dispatchAppState} />
      case STATE_TYPE.VENN_DIAGRAM_CONFIG:    return <VennDiagramConfig diagram={vennDiagram} dispatchAppState={dispatchAppState} />
      default:                                return null
    }
  }

  function getFeatureChoice(): ReactElement {
    return (
      <Fragment>
        <FeatureChoice dispatchAppState={dispatchAppState} setShowDialog={setShowDialog} />
        { showDialog && (
          <NewPopulationDialog
            population={population}
            setPopulation={setPopulation}
            maxCount={maxCount}
            onClose={() => setShowDialog(false)}
          />
        )}
      </Fragment>
    )
  }
}

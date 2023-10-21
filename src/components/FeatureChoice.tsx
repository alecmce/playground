import { ReactElement, memo } from 'react'

import { Button, ListItemDecorator, Option, Select, Stack } from '@mui/joy'
import { AppStateAction, STATE_TYPE, jump } from 'src/model/app-state'
import { BarChartIcon, CarrollDiagramIcon, PieChartIcon, PopulationIcon, VennDiagramIcon } from './Icons'

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
        color="success"
        onClick={onPopulationToggle}
        startDecorator={<PopulationIcon />}
        variant="solid"
      >
        Population
      </Button>
      <Select
        color="primary"
        disabled={disabled}
        onChange={selectChart}
        placeholder="Show Chart…"
        sx={{ width: 150 }}
        variant="solid"
      >
        <Option value={STATE_TYPE.BAR_CHART_CONFIG} label="Bar Chart">
          <ListItemDecorator>
            <BarChartIcon />
          </ListItemDecorator>
            Bar Chart
        </Option>
        <Option value={STATE_TYPE.PIE_CHART_CONFIG} label="Pie Chart">
          <ListItemDecorator>
            <PieChartIcon />
          </ListItemDecorator>
            Pie Chart
        </Option>
        <Option value={STATE_TYPE.CARROLL_DIAGRAM_CONFIG} label="Carroll Diagram">
          <ListItemDecorator>
            <CarrollDiagramIcon />
          </ListItemDecorator>
            Carroll Diagram
        </Option>
        <Option value={STATE_TYPE.VENN_DIAGRAM_CONFIG} label="Venn Diagram">
          <ListItemDecorator>
            <VennDiagramIcon />
          </ListItemDecorator>
            Venn Diagram
        </Option>
      </Select>
    </Stack>
  )

  function onPopulationToggle(): void {
    setShowDialog(true)
  }

  function selectChart(_: unknown, type: STATE_TYPE | null): void {
    if (type !== null) {
      dispatchAppState(jump({ type, time: 0 }))
    }
  }
}

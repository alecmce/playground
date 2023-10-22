import { ReactElement } from 'react'

import { ListItemDecorator, Option, Select } from '@mui/joy'
import { AppStateAction, STATE_TYPE, jump } from 'src/model/app-state'
import { BarChartIcon, CarrollDiagramIcon, PieChartIcon, VennDiagramIcon } from './Icons'

interface Props {
  disabled?:        true
  dispatchAppState: (action: AppStateAction) => void
}

export function ChartSelect(props: Props): ReactElement {
  const { disabled, dispatchAppState } = props

  return (
    <Select
      color="primary"
      disabled={disabled}
      onChange={selectChart}
      placeholder="Show Chart…"
      sx={{ width: 150, fontSize: 'sm' }}
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
  )

  function selectChart(_: unknown, type: STATE_TYPE | null): void {
    if (type !== null) {
      dispatchAppState(jump({ type, time: 0 }))
    }
  }
}

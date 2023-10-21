import { Stack } from '@mui/joy'
import { ReactElement, useState } from 'react'
import { AppStateAction, CHART_TYPE, STATE_TYPE, jump } from 'src/model/app-state'
import { SetInclusionChart } from 'src/model/charts'
import { SetInclusionState } from 'src/model/creatures'
import { CloseButton } from './CloseButton'
import { GoButton } from './GoButton'
import { SetInclusionStatePicker } from './SetInclusionStatePicker'


interface Props {
  chartType:        CHART_TYPE
  diagram:          SetInclusionChart
  dispatchAppState: (action: AppStateAction) => void
  FirstIcon:        ReactElement
  SecondIcon:       ReactElement
  name:             string
}

export function SetInclusionDiagramConfig(props: Props): ReactElement {
  const { chartType, diagram, dispatchAppState, FirstIcon, SecondIcon, name } = props

  const [first, setFirst] = useState<SetInclusionState>({})
  const [second, setSecond] = useState<SetInclusionState>({})

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center', alignItems: 'center' }}>
      <CloseButton dispatchAppState={dispatchAppState} />
      <Stack spacing={2} direction="column" sx={{ mb: 0, justifyContent: 'center' }}>
        <SetInclusionStatePicker Icon={FirstIcon} values={first} setValues={setFirst} size={30} />
        <SetInclusionStatePicker Icon={SecondIcon} values={second} setValues={setSecond} size={30} />
      </Stack>
      <GoButton label={`Select ${name} Diagram`} onClick={onClick} />
    </Stack>
  )

  function onClick(): void {
    diagram.init([first, second])
    dispatchAppState(jump({ chart: chartType, type: STATE_TYPE.ENTER_PLACES, time: 0 }))
  }
}

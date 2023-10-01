import { PlayArrow } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'
import { Box, Stack } from '@mui/joy'
import { IconButton } from '@mui/material'
import { ReactElement, useState } from 'react'
import { AppStateAction, CHART_TYPE, STATE_TYPE, jump } from 'src/model/app-state'
import { SetInclusionChart } from 'src/model/charts'
import { SetInclusionState } from 'src/model/creatures'
import { FirstCategoryView, SecondCategoryView } from './Icons'
import { SetInclusionStatePicker } from './SetInclusionStatePicker'


interface Props {
  diagram:          SetInclusionChart
  dispatchAppState: (action: AppStateAction) => void
}

export function CarrollDiagramConfig(props: Props): ReactElement {
  const { diagram, dispatchAppState } = props

  const [first, setFirst] = useState<SetInclusionState>({})
  const [second, setSecond] = useState<SetInclusionState>({})

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center', alignItems: 'center' }}>
      <IconButton aria-label="Cancel" onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <Stack spacing={2} direction="column" sx={{ mb: 0, justifyContent: 'center' }}>
        <SetInclusionStatePicker Icon={<FirstCategoryView />} values={first} setValues={setFirst} size={30} />
        <SetInclusionStatePicker Icon={<SecondCategoryView />} values={second} setValues={setSecond} size={30} />
      </Stack>
      <Box>
        <IconButton aria-label="Select Carroll Diagram" size="large" onClick={onClick}>
          <PlayArrow />
        </IconButton>
      </Box>
    </Stack>
  )

  function onClose(): void {
    dispatchAppState(jump({ type: STATE_TYPE.FREE, time: 0 }))
  }

  function onClick(): void {
    diagram.init([first, second])
    dispatchAppState(jump({ chart: CHART_TYPE.CARROLL_DIAGRAM, type: STATE_TYPE.ENTER_PLACES, time: 0 }))
  }
}

import { Stack, Typography } from '@mui/joy'
import { ReactElement } from 'react'
import { AppState, AppStateAction, STATE_TYPE, jump } from 'src/model/app-state'
import { CloseButton } from './CloseButton'

export interface Props {
  dispatchAppState: (action: AppStateAction) => void
  name:             string
  state:            AppState
}

export function PuzzleActive(props: Props): ReactElement {
  const { dispatchAppState, name, state } = props

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center', alignItems: 'center' }}>
      <CloseButton onClose={onClose} />
      <Typography>{ name }</Typography>
    </Stack>
  )

  function onClose(): void {
    const { puzzle } = state
    dispatchAppState(jump({ puzzle, time: 0, type: STATE_TYPE.EXIT_PUZZLE }))
  }
}

import { Stack, Typography } from '@mui/joy'
import { Portal } from '@mui/material'
import { ReactElement } from 'react'
import { AppState, AppStateAction, PUZZLE_TYPE, STATE_TYPE, jump } from 'src/model/app-state'
import { InTheRingMetadata } from 'src/model/puzzle'
import { CloseButton } from './CloseButton'
import { InTheRingInfo } from './InTheRingPuzzleInfo'

export interface Props {
  dispatchAppState: (action: AppStateAction) => void
  infoContainer:    HTMLElement | null
  name:             string
  state:            AppState
}

export function PuzzleActive(props: Props): ReactElement {
  const { dispatchAppState, infoContainer, name, state } = props

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center', alignItems: 'center' }}>
      <CloseButton onClose={onClose} />
      <Typography>{ name }</Typography>
      <Portal container={infoContainer}>
        <PuzzleInfo {...props} />
      </Portal>
    </Stack>
  )

  function onClose(): void {
    const { puzzle } = state
    dispatchAppState(jump({ puzzle, time: 0, type: STATE_TYPE.EXIT_PUZZLE }))
  }
}

function PuzzleInfo(props: Props): ReactElement | null {
  const { state } = props
  const { puzzle, metadata } = state

  switch (puzzle?.type) {
    case PUZZLE_TYPE.IN_THE_RING: return metadata ? <InTheRingInfo metadata={metadata as InTheRingMetadata} /> : null
    default:                      return null
  }
}


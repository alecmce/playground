import { ReactElement } from 'react'

import { ListItemDecorator, Option, Select } from '@mui/joy'
import { AppStateAction, STATE_TYPE, jump } from 'src/model/app-state'
import { InTheRingIcon } from './Icons'

interface Props {
  disabled?:        true
  dispatchAppState: (action: AppStateAction) => void
}

export function PuzzleSelect(props: Props): ReactElement {
  const { disabled, dispatchAppState } = props

  return (
    <Select
      color="primary"
      disabled={disabled}
      onChange={selectPuzzle}
      placeholder="Start Puzzle…"
      sx={{ width: 150, fontSize: 'sm' }}
      variant="solid"
    >
      <Option value={STATE_TYPE.IN_THE_RING_CONFIG} label="In The Ring">
        <ListItemDecorator>
          <InTheRingIcon />
        </ListItemDecorator>
          In The Ring
      </Option>
    </Select>
  )

  function selectPuzzle(_: unknown, type: STATE_TYPE | null): void {
    if (type !== null) {
      dispatchAppState(jump({ type, time: 0 }))
    }
  }
}

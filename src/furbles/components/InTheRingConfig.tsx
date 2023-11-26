import { KeyboardArrowDown } from '@mui/icons-material'
import { Option, Select, Stack } from '@mui/joy'
import { ReactElement, useState } from 'react'
import { AppStateAction, PUZZLE_TYPE, PuzzleSetupModel, STATE_TYPE, jump } from 'src/model/app-state'
import { CloseButton } from './CloseButton'
import { GoButton } from './GoButton'

export interface Props {
  dispatchAppState: (action: AppStateAction) => void
}

export function InTheRingConfig(props: Props): ReactElement {
  const { dispatchAppState } = props

  const [complexity, setComplexity] = useState<1 | 2 | 3>(1)

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center', alignItems: 'center' }}>
      <CloseButton onClose={onClose} />
      <Stack spacing={2} direction="column" sx={{ mb: 0, justifyContent: 'center' }}>
        <Select
          color="neutral"
          onChange={onChange}
          value={complexity}
          variant="soft"
          sx={{ width: 120 }}
          indicator={<KeyboardArrowDown />}
        >
          <Option value={1}>Level 1</Option>
          <Option value={2}>Level 2</Option>
          <Option value={3}>Level 3</Option>
        </Select>
      </Stack>
      <GoButton label={'Select Puzzle'} onClick={onClick} />
    </Stack>
  )

  function onChange(_: any, value: 1 | 2 | 3 | null): void {
    setComplexity(value ?? 1)
  }

  function onClose(): void {
    dispatchAppState(jump({ type: STATE_TYPE.FREE, time: 0 }))
  }

  function onClick(): void {
    const puzzle: PuzzleSetupModel = { complexity, type: PUZZLE_TYPE.IN_THE_RING }
    dispatchAppState(jump({ type: STATE_TYPE.ENTER_PUZZLE, time: 0, puzzle }))
  }
}

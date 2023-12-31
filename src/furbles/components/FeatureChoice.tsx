import { ReactElement, memo } from 'react'

import { Stack } from '@mui/joy'
import { AppStateAction } from 'src/model/app-state'
import { ChartSelect } from './ChartSelect'
import { HomeButton } from './HomeButton'
import { PopulationButton } from './PopulationButton'
import { PuzzleSelect } from './PuzzleSelect'

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
      <HomeButton />
      <PopulationButton setShowDialog={setShowDialog} />
      <ChartSelect disabled={disabled} dispatchAppState={dispatchAppState} />
      <PuzzleSelect disabled={disabled} dispatchAppState={dispatchAppState} />
    </Stack>
  )
}

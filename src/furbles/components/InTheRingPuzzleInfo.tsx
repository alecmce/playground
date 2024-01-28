import { CheckCircle, Dangerous } from '@mui/icons-material'
import { Sheet, Stack, Typography } from '@mui/joy'
import { ReactElement, useState } from 'react'
import { AppStateAction, PUZZLE_TYPE, PuzzleSetupModel, STATE_TYPE, jump } from 'src/model/app-state'
import { Creature } from 'src/model/creatures'
import { InTheRingMetadata } from 'src/model/puzzle'
import { HelpButton } from './HelpButton'
import { RefreshButton } from './RefreshButton'

interface Props {
  dispatchAppState: (action: AppStateAction) => void
  metadata:         InTheRingMetadata
  puzzle:           PuzzleSetupModel
}

export function InTheRingInfo(props: Props): ReactElement {
  const { dispatchAppState } = props

  const [showHelp, setShowHelp] = useState(false)

  return (
    <Sheet>
      <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center', alignItems: 'center' }}>
        <Typography level="h2" fontSize="2rem" color="primary" style={{marginTop: '0.2em'}}>In The Ring</Typography>
        <HelpButton onClick={onHelpClick} label="Help" />
        <RefreshButton onClick={onRefresh} label="New Puzzle" />
      </Stack>
      <Sheet variant="soft" style={{ padding: '6px 18px', borderRadius: '12px', backgroundColor: 'rgba(240, 244, 248, 0.8)' }}>
        <Dots {...props} />
      </Sheet>
      { showHelp && <Help /> }
    </Sheet>
  )

  function onHelpClick(): void {
    setShowHelp(!showHelp)
  }

  function onRefresh(): void {
    const { puzzle: { complexity } } = props
    const puzzle: PuzzleSetupModel = { complexity, type: PUZZLE_TYPE.IN_THE_RING }
    dispatchAppState(jump({ type: STATE_TYPE.ENTER_PUZZLE, time: 0, puzzle }))
  }
}

const RIGHT = '#33CC00'
const WRONG = '#ff8000'
const SIZE = '3em'
const TYPOGRAPHY_SIZE = '2.5em'

function Dots(props: Props): ReactElement {
  const { metadata: { right, wrong } } = props

  const count = right.length  + wrong.length

  return count > 6
    ? <NumberedDots {...props} />
    : <IndividualDots {...props} />
}

function NumberedDots(props: Props): ReactElement {
  const { metadata: { right, wrong } } = props

  return (
    <Stack direction="row" style={{height: SIZE, justifyContent: 'center', alignItems: 'center'}}>
      <Typography fontSize={TYPOGRAPHY_SIZE} style={{color:RIGHT, marginTop: '0.2em'}}>{ right.length }</Typography>
      <CheckCircle style={{ fontSize: SIZE, color: RIGHT }} />
      <Dangerous style={{  fontSize: SIZE, color: WRONG }} />
      <Typography fontSize={TYPOGRAPHY_SIZE} style={{color:WRONG, marginTop: '0.2em'}}>{ wrong.length }</Typography>
    </Stack>
  )
}

function IndividualDots(props: Props): ReactElement {
  const { metadata: { right, wrong } } = props

  return (
    <Stack direction="row" style={{height: SIZE, justifyContent: 'center', alignItems: 'center'}}>
      { right?.map((c: Creature) => <CheckCircle key={c.id} style={{ fontSize: SIZE, color: RIGHT }} />) }
      { wrong?.map((c: Creature) => <Dangerous key={c.id} style={{  fontSize: SIZE, color: WRONG }} />) }
    </Stack>
  )
}

function Help(): ReactElement {

  return (
    <Stack direction="row" sx={{ mb: 0, justifyContent: 'center', alignItems: 'center' }}>
      <Stack direction="column" style={{ display: 'flex', maxWidth: '800px' }}>
        <Typography padding={1}>
        Depending on their coulour, shape or number of eyes, some Furbles belong inside the ring and some outside. Drag
        them into and out of the ring until all the Furbles belong. This bar at the top will tell you how many are in
        the right place and how many are in the wrong place.
        </Typography>
        <Typography padding={1}>
          Click on the refresh button to change the puzzle.
        </Typography>
      </Stack>
    </Stack>
  )
}

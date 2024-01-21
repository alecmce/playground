import { CheckCircle, Dangerous } from '@mui/icons-material'
import { Sheet, Stack, Typography } from '@mui/joy'
import { ReactElement, useState } from 'react'
import { Creature } from 'src/model/creatures'
import { InTheRingMetadata } from 'src/model/puzzle'
import { HelpButton } from './HelpButton'
import { RefreshButton } from './RefreshButton'

interface Props {
  metadata: InTheRingMetadata
}

export function InTheRingInfo(props: Props): ReactElement {
  const [showHelp, setShowHelp] = useState(false)

  const backgroundColor = showHelp ? 'rgb(240, 244, 248)' : 'rgb(240, 244, 248, 0.8)'

  return (
    <Sheet variant="soft" style={{ padding: '0 12px', borderRadius: '12px', backgroundColor }}>
      <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center', alignItems: 'center' }}>
        <Typography level="h2" fontSize="2rem" color="primary" style={{marginTop: '0.2em'}}>In The Ring</Typography>
        <HelpButton onClick={onHelpClick} label="Help" />
        <RefreshButton onClick={onRefresh} label="New Puzzle" />
        <Dots {...props} />
      </Stack>
      { showHelp && <Help /> }
    </Sheet>
  )

  function onHelpClick(): void {
    setShowHelp(!showHelp)
  }

  function onRefresh(): void {

  }
}

const RIGHT = '#33CC00'
const WRONG = '#ff8000'

function Dots(props: Props): ReactElement {
  const { metadata: { right, wrong } } = props

  const count = right.length  + wrong.length

  if (count > 6) {
    return (
      <Stack direction="row" style={{height: '4rem', justifyContent: 'center', alignItems: 'center'}}>
        <Typography fontSize="3rem" style={{color:RIGHT, marginTop: '0.2em'}}>{ right.length }</Typography>
        <CheckCircle style={{ fontSize: '4rem', color: RIGHT }} />
        <Dangerous style={{  fontSize: '4rem', color: WRONG }} />
        <Typography fontSize="3rem" style={{color:WRONG, marginTop: '0.2em'}}>{ wrong.length }</Typography>
      </Stack>
    )
  } else {
    return (
      <Stack direction="row" style={{height: '4rem', justifyContent: 'center', alignItems: 'center'}}>
        { right?.map((c: Creature) => <CheckCircle key={c.id} style={{ fontSize: '4rem', color: RIGHT }} />) }
        { wrong?.map((c: Creature) => <Dangerous key={c.id} style={{  fontSize: '4rem', color: WRONG }} />) }
      </Stack>
    )
  }
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

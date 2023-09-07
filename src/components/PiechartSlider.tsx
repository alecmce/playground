import { Slider, Stack } from '@mui/material'
import { ReactElement, useMemo } from 'react'

import Pause from '@mui/icons-material/Pause'
import PlayArrow from '@mui/icons-material/PlayArrow'
import { STATE_DURATIONS } from 'src/lib/app-state'
import { STATE_TYPE, State, StateAction } from 'src/model/app-state'

interface Props {
  state:            State
  dispatchAppState: (action: StateAction) => void
}

export function PiechartSlider(props: Props): ReactElement {
  const { state, dispatchAppState } = props
  const { type } = state

  const time = useMemo(() => getTime(state), [state])
  const duration = useDuration()
  const isPlay = useMemo(() => type !== STATE_TYPE.FREE && type !== STATE_TYPE.PIE_OVERLAID, [type])

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
      <Slider aria-label="Volume" value={time} min={0} max={duration} onChange={onChange} />
      { isPlay ? <Pause onClick={onPause} /> : <PlayArrow onClick={onPlay} /> }
    </Stack>
  )

  function onPlay(): void {

  }

  function onPause(): void {

  }

  function onChange(event: Event, newValue: number | number[]): void {
    debugger
  }
}

function useDuration(): number {
  const enterPie = STATE_DURATIONS[STATE_TYPE.ENTER_PIE]
  const enterOverlay = STATE_DURATIONS[STATE_TYPE.ENTER_OVERLAY_PIE]
  const exitOverlay = STATE_DURATIONS[STATE_TYPE.EXIT_OVERLAY_PIE]
  const exitPie = STATE_DURATIONS[STATE_TYPE.EXIT_PIE]
  return enterPie + enterOverlay + exitOverlay + exitPie
}

function getTime(state: State): number {
  const enterPie = STATE_DURATIONS[STATE_TYPE.ENTER_PIE]
  const enterOverlay = STATE_DURATIONS[STATE_TYPE.ENTER_OVERLAY_PIE]
  const exitOverlay = STATE_DURATIONS[STATE_TYPE.EXIT_OVERLAY_PIE]

  switch (state.type) {
    case STATE_TYPE.ENTER_PIE:         return state.time
    case STATE_TYPE.ENTER_OVERLAY_PIE: return state.time + enterPie
    case STATE_TYPE.PIE_OVERLAID:      return enterPie + enterOverlay
    case STATE_TYPE.EXIT_OVERLAY_PIE:  return state.time + enterPie + enterOverlay
    case STATE_TYPE.EXIT_PIE:          return state.time + enterPie + enterOverlay + exitOverlay
    default:                           return NaN
  }
}

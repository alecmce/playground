import { Slider, Stack } from '@mui/material'
import { ReactElement, useMemo } from 'react'

import Pause from '@mui/icons-material/Pause'
import PlayArrow from '@mui/icons-material/PlayArrow'
import { STATE_DURATIONS } from 'src/lib/app-state'
import { STATE_TYPE, AppState, AppStateAction, togglePause, jump } from 'src/model/app-state'

interface Props {
  state:            AppState
  dispatchAppState: (action: AppStateAction) => void
}

export function PiechartSlider(props: Props): ReactElement {
  const { state, dispatchAppState } = props
  const { type, isPaused } = state

  const time = useMemo(() => getTime(state), [state])
  const duration = useDuration()
  const isPlay = useMemo(() => type !== STATE_TYPE.FREE && type !== STATE_TYPE.PIE_OVERLAID && !isPaused, [type])

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
      <Slider aria-label="Volume" value={time} min={0} max={duration} onChange={onChange} />
      { isPlay ? <Pause onClick={onPause} /> : <PlayArrow onClick={onPlay} /> }
    </Stack>
  )

  function onPlay(): void {
    if (isPaused) {
      dispatchAppState(togglePause())
    } else if (type == STATE_TYPE.PIE_OVERLAID) {
      dispatchAppState(jump({ type: STATE_TYPE.EXIT_OVERLAY_PIE, time: 0 }))
    }
  }

  function onPause(): void {
    dispatchAppState(togglePause())
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

function getTime(state: AppState): number {
  const enterPie = STATE_DURATIONS[STATE_TYPE.ENTER_PIE]
  const enterOverlay = STATE_DURATIONS[STATE_TYPE.ENTER_OVERLAY_PIE]
  const exitOverlay = STATE_DURATIONS[STATE_TYPE.EXIT_OVERLAY_PIE]

  switch (state.type) {
    case STATE_TYPE.ENTER_PIE:         return state.time
    case STATE_TYPE.ENTER_OVERLAY_PIE: return enterPie + state.time
    case STATE_TYPE.PIE_OVERLAID:      return enterPie + enterOverlay
    case STATE_TYPE.EXIT_OVERLAY_PIE:  return enterPie + enterOverlay + state.time
    case STATE_TYPE.EXIT_PIE:          return enterPie + enterOverlay + exitOverlay + state.time
    default:                           return NaN
  }
}

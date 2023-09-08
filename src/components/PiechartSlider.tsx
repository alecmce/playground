import { Slider, Stack } from '@mui/material'
import { ReactElement, ReactNode, useMemo } from 'react'

import CloseIcon from '@mui/icons-material/Close'
import Pause from '@mui/icons-material/Pause'
import PlayArrow from '@mui/icons-material/PlayArrow'
import { STATE_DURATIONS } from 'src/lib/app-state'
import { AppState, AppStateAction, STATE_TYPE, jump, togglePause } from 'src/model/app-state'

interface Props {
  state:            AppState
  dispatchAppState: (action: AppStateAction) => void
}

export function PiechartSlider(props: Props): ReactElement {
  const { state, dispatchAppState } = props
  const { type, isPaused } = state
  const time = getTime(state)

  const duration = useDuration()
  const marks = useMemo(() => getMarks(), [])
  const isPlay = useMemo(() => type !== STATE_TYPE.FREE && type !== STATE_TYPE.PIE_OVERLAID && !isPaused, [type])

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
      <div style={{width: 24, height: 24}} />
      <CloseIcon onClick={onClose} />
      <Slider
        aria-label="Volume"
        value={time}
        min={0}
        max={duration}
        onChange={onChange}
        marks={marks}
      />
      { isPlay ? <Pause onClick={onPause} /> : <PlayArrow onClick={onPlay} /> }
    </Stack>
  )

  function onPlay(): void {
    if (type == STATE_TYPE.PIE_OVERLAID) {
      dispatchAppState(jump({ type: STATE_TYPE.EXIT_OVERLAY_PIE, time: 0 }))
    } else if (isPaused) {
      dispatchAppState(togglePause())
    }
  }

  function onPause(): void {
    dispatchAppState(togglePause())
  }

  function onClose(): void {
    const enterDuration = STATE_DURATIONS[STATE_TYPE.ENTER_PIE]
    const exitDuration = STATE_DURATIONS[STATE_TYPE.EXIT_PIE]
    const closeDuration = STATE_DURATIONS[STATE_TYPE.CLOSE_PIE]

    dispatchAppState(jump({ type: STATE_TYPE.CLOSE_PIE, time: getTime() }))

    function getTime(): number {
      switch (type) {
        case STATE_TYPE.ENTER_PIE: return closeDuration * (1 - time) / enterDuration
        case STATE_TYPE.EXIT_PIE:  return closeDuration * time / exitDuration
        default:                   return 0
      }
    }
  }

  function onChange(_: Event, value: number | number[]): void {
    const time = value as number

    const enterPie = STATE_DURATIONS[STATE_TYPE.ENTER_PIE]
    const enterOverlay = STATE_DURATIONS[STATE_TYPE.ENTER_OVERLAY_PIE]
    const exitOverlay = STATE_DURATIONS[STATE_TYPE.EXIT_OVERLAY_PIE]

    dispatchAppState(jump({ ...getState(), isPaused: true }))

    function getState(): Omit<AppState, 'duration'> {
      if (time < enterPie) {
        return { type: STATE_TYPE.ENTER_PIE, time }
      } else if (time < enterPie + enterOverlay) {
        return { type: STATE_TYPE.ENTER_OVERLAY_PIE, time: time - enterPie }
      } else if (time < enterPie + enterOverlay + exitOverlay) {
        return { type: STATE_TYPE.EXIT_OVERLAY_PIE, time: time - enterPie - enterOverlay }
      } else {
        return { type: STATE_TYPE.EXIT_PIE, time: time - enterPie - enterOverlay - exitOverlay }
      }
    }
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

interface Mark {
  value: number
  label?: ReactNode | string
}

function getMarks(): Mark[] {
  const enterPie = STATE_DURATIONS[STATE_TYPE.ENTER_PIE]
  const enterOverlay = STATE_DURATIONS[STATE_TYPE.ENTER_OVERLAY_PIE]
  const exitOverlay = STATE_DURATIONS[STATE_TYPE.EXIT_OVERLAY_PIE]
  const exitPie = STATE_DURATIONS[STATE_TYPE.EXIT_PIE]

  return [
    { value: 0, label: 'Start'},
    { value: enterPie, label: 'In Place' },
    { value: enterPie + enterOverlay, label: 'Pie Chart' },
    { value: enterPie + enterOverlay + exitOverlay, label: 'In Place' },
    { value: enterPie + enterOverlay + exitOverlay + exitPie, label: 'End' },
  ]
}

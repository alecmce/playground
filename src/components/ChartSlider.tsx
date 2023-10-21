import CloseIcon from '@mui/icons-material/Close'
import Pause from '@mui/icons-material/Pause'
import PlayArrow from '@mui/icons-material/PlayArrow'
import { Stack } from '@mui/joy'
import IconButton from '@mui/joy/IconButton'
import Slider from '@mui/material/Slider'
import { styled } from '@mui/material/styles'
import { ReactElement, ReactNode, useMemo } from 'react'
import { STATE_DURATIONS } from 'src/lib/app-state'
import { AppState, AppStateAction, STATE_TYPE, jump, togglePause } from 'src/model/app-state'

interface Props {
  state:            AppState
  dispatchAppState: (action: AppStateAction) => void
}

const SLIDER_STYLES = {
  '&.MuiSlider-root': {
    maxWidth: '100%',
    width:    '600px',
  },
  '& .MuiSlider-thumb': {
    transition: 'none'
  },
  '& .MuiSlider-track': {
    transition: 'none'
  },
}

const ImmediateSlider = styled(Slider)(() => SLIDER_STYLES)

export function ChartSlider(props: Props): ReactElement {
  const { state, dispatchAppState } = props
  const { type, isPaused } = state
  const time = getTime(state)

  const duration = useDuration()
  const marks = useMemo(() => getMarks(), [])
  const isPlay = type !== STATE_TYPE.FREE && type !== STATE_TYPE.FULL_OVERLAY && !isPaused

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 1, alignItems: 'center' }}>
      <IconButton aria-label="Close current chart" onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <ImmediateSlider
        aria-label="Volume"
        value={time}
        min={0}
        max={duration}
        onChange={onChange}
        marks={marks}
      />
      <IconButton aria-label="Toggle play state" onClick={isPlay ? onPause : onPlay}>
        { isPlay ? <Pause /> : <PlayArrow /> }
      </IconButton>
    </Stack>
  )

  function onPlay(): void {
    const { chart } = state

    if (type == STATE_TYPE.FULL_OVERLAY) {
      dispatchAppState(jump({ chart, type: STATE_TYPE.EXIT_OVERLAY, time: 0 }))
    } else if (isPaused) {
      dispatchAppState(togglePause())
    }
  }

  function onPause(): void {
    dispatchAppState(togglePause())
  }

  function onClose(): void {
    const { chart } = state

    const enterDuration = STATE_DURATIONS[STATE_TYPE.ENTER_PLACES]
    const exitDuration = STATE_DURATIONS[STATE_TYPE.LEAVE_PLACES]
    const closeDuration = STATE_DURATIONS[STATE_TYPE.CLOSE_CHART]

    dispatchAppState(jump({ chart, type: STATE_TYPE.CLOSE_CHART, time: getTime() }))

    function getTime(): number {
      switch (type) {
        case STATE_TYPE.ENTER_PLACES: return closeDuration * (1 - time) / enterDuration
        case STATE_TYPE.LEAVE_PLACES: return closeDuration * time / exitDuration
        default:                      return 0
      }
    }
  }

  function onChange(_: Event, value: number | number[]): void {
    const time = value as number

    const enterChart = STATE_DURATIONS[STATE_TYPE.ENTER_PLACES]
    const enterOverlay = STATE_DURATIONS[STATE_TYPE.ENTER_OVERLAY]
    const exitOverlay = STATE_DURATIONS[STATE_TYPE.EXIT_OVERLAY]

    dispatchAppState(jump({ ...getState(), isPaused: true }))

    function getState(): Omit<AppState, 'duration'> {
      const { chart } = state

      if (time < enterChart) {
        return { chart, type: STATE_TYPE.ENTER_PLACES, time }
      } else if (time < enterChart + enterOverlay) {
        return { chart, type: STATE_TYPE.ENTER_OVERLAY, time: time - enterChart }
      } else if (time < enterChart + enterOverlay + exitOverlay) {
        return { chart, type: STATE_TYPE.EXIT_OVERLAY, time: time - enterChart - enterOverlay }
      } else {
        return { chart, type: STATE_TYPE.LEAVE_PLACES, time: time - enterChart - enterOverlay - exitOverlay }
      }
    }
  }
}

function useDuration(): number {
  const enterChart = STATE_DURATIONS[STATE_TYPE.ENTER_PLACES]
  const enterOverlay = STATE_DURATIONS[STATE_TYPE.ENTER_OVERLAY]
  const exitOverlay = STATE_DURATIONS[STATE_TYPE.EXIT_OVERLAY]
  const exitChart = STATE_DURATIONS[STATE_TYPE.LEAVE_PLACES]
  return enterChart + enterOverlay + exitOverlay + exitChart
}

function getTime(state: AppState): number {
  const enterChart = STATE_DURATIONS[STATE_TYPE.ENTER_PLACES]
  const enterOverlay = STATE_DURATIONS[STATE_TYPE.ENTER_OVERLAY]
  const exitOverlay = STATE_DURATIONS[STATE_TYPE.EXIT_OVERLAY]

  switch (state.type) {
    case STATE_TYPE.ENTER_PLACES:  return state.time
    case STATE_TYPE.ENTER_OVERLAY: return enterChart + state.time
    case STATE_TYPE.FULL_OVERLAY:  return enterChart + enterOverlay
    case STATE_TYPE.EXIT_OVERLAY:  return enterChart + enterOverlay + state.time
    case STATE_TYPE.LEAVE_PLACES:  return enterChart + enterOverlay + exitOverlay + state.time
    default:                       return NaN
  }
}

interface Mark {
  value: number
  label?: ReactNode | string
}

function getMarks(): Mark[] {
  const enterChart = STATE_DURATIONS[STATE_TYPE.ENTER_PLACES]
  const enterOverlay = STATE_DURATIONS[STATE_TYPE.ENTER_OVERLAY]
  const exitOverlay = STATE_DURATIONS[STATE_TYPE.EXIT_OVERLAY]
  const exitChart = STATE_DURATIONS[STATE_TYPE.LEAVE_PLACES]

  return [
    { value: 0, label: 'Start'},
    { value: enterChart, label: 'In Place' },
    { value: enterChart + enterOverlay, label: 'Chart' },
    { value: enterChart + enterOverlay + exitOverlay, label: 'In Place' },
    { value: enterChart + enterOverlay + exitOverlay + exitChart, label: 'End' },
  ]
}

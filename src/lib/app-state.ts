import { useReducer } from 'react'
import { AppState, AppStateAction, CHART_TYPE, PuzzleSetupModel, STATE_ACTION_TYPE, STATE_TYPE } from 'src/model/app-state'


export function useAppState(): [AppState, (state: AppStateAction) => void] {
  return useReducer(stateReducer, { type: STATE_TYPE.FREE, duration: 0, time: 0 })
}

export function stateReducer(state: AppState, action: AppStateAction): AppState {
  const { isPaused } = state
  const { type } = action

  switch (type) {
    case STATE_ACTION_TYPE.JUMP:         return withDuration(action.state)
    case STATE_ACTION_TYPE.ITERATE:      return isPaused ? state : iterate(state, action.deltaTime)
    case STATE_ACTION_TYPE.TRIGGER_PIE:  return triggerPie(state)
    case STATE_ACTION_TYPE.TOGGLE_PAUSE: return togglePause(state)
    case STATE_ACTION_TYPE.SET_METADATA: return setMetadata(action.metadata)
  }

  function iterate(state: AppState, deltaTime: number): AppState {
    const { time, type } = state
    const result = { ...state, time: time + deltaTime }
    const transition = TRANSITION_STATES[type]

    return transition
      ? transition(result)
      : result
  }

  function triggerPie(state: AppState): AppState {
    switch (state.type) {
      case STATE_TYPE.FREE:         return withDuration({ type: STATE_TYPE.ENTER_PLACES, time: 0 })
      case STATE_TYPE.FULL_OVERLAY: return withDuration({ type: STATE_TYPE.EXIT_OVERLAY, time: 0 })
      default:                      return state
    }
  }

  function togglePause(state: AppState): AppState {
    return { ...state, isPaused: !state.isPaused }
  }

  function setMetadata<T extends object>(metadata: T): AppState {
    return { ...state, metadata }
  }
}

interface TransitionProps {
  prev?: TransitionConfig
  next?: TransitionConfig
}

type TransitionConfig = STATE_TYPE | { type: STATE_TYPE, isPaused: true }

interface TransitionState {
  (state: AppState): AppState
}

export const STATE_DURATIONS: Record<STATE_TYPE, number> = {
  [STATE_TYPE.BAR_CHART_CONFIG]:       Infinity,
  [STATE_TYPE.CARROLL_DIAGRAM_CONFIG]: Infinity,
  [STATE_TYPE.CLOSE_CHART]:            500,
  [STATE_TYPE.ENTER_OVERLAY]:          3000,
  [STATE_TYPE.ENTER_PLACES]:           3000,
  [STATE_TYPE.EXIT_OVERLAY]:           3000,
  [STATE_TYPE.FREE]:                   Infinity,
  [STATE_TYPE.FULL_OVERLAY]:           Infinity,
  [STATE_TYPE.LEAVE_PLACES]:           2000,
  [STATE_TYPE.PIE_CHART_CONFIG]:       Infinity,
  [STATE_TYPE.VENN_DIAGRAM_CONFIG]:    Infinity,
  [STATE_TYPE.IN_THE_RING_CONFIG]:     Infinity,
  [STATE_TYPE.ENTER_PUZZLE]:           2000,
  [STATE_TYPE.EXIT_PUZZLE]:            1000,
  [STATE_TYPE.PUZZLE_MAIN]:            Infinity,
}

const TRANSITION_STATES: Partial<Record<STATE_TYPE, TransitionState>> = {
  [STATE_TYPE.ENTER_PLACES]: makeTransitionState({
    next: STATE_TYPE.ENTER_OVERLAY,
    prev: STATE_TYPE.FREE,
  }),
  [STATE_TYPE.ENTER_OVERLAY]: makeTransitionState({
    next: { type: STATE_TYPE.FULL_OVERLAY, isPaused: true },
    prev: STATE_TYPE.ENTER_PLACES,
  }),
  [STATE_TYPE.FULL_OVERLAY]: makeTransitionState({
    next: STATE_TYPE.EXIT_OVERLAY,
    prev: STATE_TYPE.ENTER_OVERLAY,
  }),
  [STATE_TYPE.EXIT_OVERLAY]: makeTransitionState({
    next: STATE_TYPE.LEAVE_PLACES,
    prev: { type: STATE_TYPE.FULL_OVERLAY, isPaused: true },
  }),
  [STATE_TYPE.LEAVE_PLACES]: makeTransitionState({
    next: STATE_TYPE.FREE,
    prev: STATE_TYPE.EXIT_OVERLAY,
  }),
  [STATE_TYPE.CLOSE_CHART]: makeTransitionState({
    next: STATE_TYPE.FREE,
  }),
  [STATE_TYPE.ENTER_PUZZLE]: makeTransitionState({
    next: STATE_TYPE.PUZZLE_MAIN,
    prev: STATE_TYPE.FREE,
  }),
  [STATE_TYPE.EXIT_PUZZLE]: makeTransitionState({
    next: STATE_TYPE.FREE,
    prev: STATE_TYPE.PUZZLE_MAIN,
  }),
}

function makeTransitionState(props: TransitionProps): TransitionState {
  const { prev, next } = props

  return function transition(state: AppState): AppState {
    const { chart, puzzle, duration: outgoingDuration, time } = state
    if (time > outgoingDuration) {
      return next ? resolve(chart, puzzle, next, time - outgoingDuration) : state
    } else if (time < 0) {
      return prev ? resolve(chart, puzzle, prev, outgoingDuration - time) : state
    } else {
      return state
    }

    function resolve(chart: CHART_TYPE | undefined, puzzle: PuzzleSetupModel | undefined, typeOrPartial: TransitionConfig, time: number): AppState {
      return typeof typeOrPartial === 'string'
        ? withDuration({ ...state, chart, puzzle, type: typeOrPartial, time })
        : withDuration({ ...state, chart, puzzle, ...typeOrPartial, time })
    }
  }
}

function withDuration(state: Omit<AppState, 'duration'>): AppState {
  const duration = STATE_DURATIONS[state.type]
  return {...state, duration}
}

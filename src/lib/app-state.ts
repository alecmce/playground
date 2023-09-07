import { useReducer } from 'react'
import { AppState, AppStateAction, STATE_ACTION_TYPE, STATE_TYPE } from 'src/model/app-state'


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
      case STATE_TYPE.FREE:         return withDuration({ type: STATE_TYPE.ENTER_PIE, time: 0 })
      case STATE_TYPE.PIE_OVERLAID: return withDuration({ type: STATE_TYPE.EXIT_OVERLAY_PIE, time: 0 })
      default:                      return state
    }
  }

  function togglePause(state: AppState): AppState {
    return { ...state, isPaused: !state.isPaused }
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
  [STATE_TYPE.ENTER_OVERLAY_PIE]: 3000,
  [STATE_TYPE.ENTER_PIE]:         3000,
  [STATE_TYPE.EXIT_OVERLAY_PIE]:  3000,
  [STATE_TYPE.EXIT_PIE]:          2000,
  [STATE_TYPE.FREE]:              Infinity,
  [STATE_TYPE.PIE_OVERLAID]:      Infinity,
  [STATE_TYPE.CLOSE_PIE]:         500,
}

const TRANSITION_STATES: Partial<Record<STATE_TYPE, TransitionState>> = {
  [STATE_TYPE.ENTER_PIE]: makeTransitionState({
    next: STATE_TYPE.ENTER_OVERLAY_PIE,
    prev: STATE_TYPE.FREE,
  }),
  [STATE_TYPE.ENTER_OVERLAY_PIE]: makeTransitionState({
    next: { type: STATE_TYPE.PIE_OVERLAID, isPaused: true },
    prev: STATE_TYPE.ENTER_PIE,
  }),
  [STATE_TYPE.PIE_OVERLAID]: makeTransitionState({
    next: STATE_TYPE.EXIT_OVERLAY_PIE,
    prev: STATE_TYPE.ENTER_OVERLAY_PIE,
  }),
  [STATE_TYPE.EXIT_OVERLAY_PIE]: makeTransitionState({
    next: STATE_TYPE.EXIT_PIE,
    prev: { type: STATE_TYPE.PIE_OVERLAID, isPaused: true },
  }),
  [STATE_TYPE.EXIT_PIE]: makeTransitionState({
    next: STATE_TYPE.FREE,
    prev: STATE_TYPE.EXIT_OVERLAY_PIE,
  }),
  [STATE_TYPE.CLOSE_PIE]: makeTransitionState({
    next: STATE_TYPE.FREE,
  }),
}

function makeTransitionState(props: TransitionProps): TransitionState {
  const { prev, next } = props

  return function transition(state: AppState): AppState {
    const { time, duration: outgoingDuration } = state
    if (time > outgoingDuration) {
      return next ? resolve(next, time - outgoingDuration) : state
    } else if (time < 0) {
      return prev ? resolve(prev, outgoingDuration - time) : state
    } else {
      return state
    }

    function resolve(typeOrPartial: TransitionConfig, time: number): AppState {
      return typeof typeOrPartial === 'string'
        ? withDuration({ type: typeOrPartial, time })
        : withDuration({ ...typeOrPartial, time })
    }
  }
}

function withDuration(state: Omit<AppState, 'duration'>): AppState {
  const duration = STATE_DURATIONS[state.type]
  return {...state, duration}
}

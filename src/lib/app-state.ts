import { useReducer } from 'react'
import { STATE_ACTION_TYPE, STATE_TYPE, State, StateAction } from 'src/model/app-state'


export function useAppState(): [State, (state: StateAction) => void] {
  return useReducer(stateReducer, { type: STATE_TYPE.FREE, duration: 0, time: 0 })
}

export function stateReducer(state: State, action: StateAction): State {
  switch (action.type) {
    case STATE_ACTION_TYPE.JUMP:        return action.state
    case STATE_ACTION_TYPE.ITERATE:     return iterate(state, action.deltaTime)
    case STATE_ACTION_TYPE.TRIGGER_PIE: return triggerPie(state)
  }

  function iterate(state: State, deltaTime: number): State {
    const result = { ...state, time: state.time + deltaTime }
    const transition = TRANSITION_STATES[state.type]

    return transition
      ? transition(result)
      : result
  }

  function triggerPie(state: State): State {
    switch (state.type) {
      case STATE_TYPE.FREE:         return withDuration({ type: STATE_TYPE.ENTER_PIE, time: 0 })
      case STATE_TYPE.PIE_OVERLAID: return withDuration({ type: STATE_TYPE.EXIT_OVERLAY_PIE, time: 0 })
      default:                      return state
    }
  }
}

interface TransitionProps {
  prev?: STATE_TYPE
  next?: STATE_TYPE
}

interface TransitionState {
  (state: State): State
}

export const STATE_DURATIONS: Record<STATE_TYPE, number> = {
  [STATE_TYPE.ENTER_OVERLAY_PIE]: 3000,
  [STATE_TYPE.ENTER_PIE]:         3000,
  [STATE_TYPE.EXIT_OVERLAY_PIE]:  3000,
  [STATE_TYPE.EXIT_PIE]:          2000,
  [STATE_TYPE.FREE]:              Infinity,
  [STATE_TYPE.PIE_OVERLAID]:      Infinity,
}

const TRANSITION_STATES: Partial<Record<STATE_TYPE, TransitionState>> = {
  [STATE_TYPE.ENTER_PIE]: makeTransitionState({
    next: STATE_TYPE.ENTER_OVERLAY_PIE,
    prev: STATE_TYPE.FREE,
  }),
  [STATE_TYPE.ENTER_OVERLAY_PIE]: makeTransitionState({
    next: STATE_TYPE.PIE_OVERLAID,
    prev: STATE_TYPE.ENTER_PIE,
  }),
  [STATE_TYPE.PIE_OVERLAID]: makeTransitionState({
    next: STATE_TYPE.EXIT_OVERLAY_PIE,
    prev: STATE_TYPE.ENTER_OVERLAY_PIE,
  }),
  [STATE_TYPE.EXIT_OVERLAY_PIE]: makeTransitionState({
    next: STATE_TYPE.EXIT_PIE,
    prev: STATE_TYPE.PIE_OVERLAID,
  }),
  [STATE_TYPE.EXIT_PIE]: makeTransitionState({
    next: STATE_TYPE.FREE,
    prev: STATE_TYPE.EXIT_OVERLAY_PIE,
  }),
}

function makeTransitionState(props: TransitionProps): TransitionState {
  const { prev, next } = props

  return function transition(state: State): State {
    const { time, duration: outgoingDuration } = state
    if (time > outgoingDuration) {
      return next ? withDuration({ type: next, time: time - outgoingDuration }) : state
    } else if (time < 0) {
      return prev ? withDuration({ type: prev, time: outgoingDuration - time }) : state
    } else {
      return state
    }
  }
}

function withDuration(state: Omit<State, 'duration'>): State {
  const duration = STATE_DURATIONS[state.type]
  return {...state, duration}
}

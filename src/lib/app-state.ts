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
    return state.type === STATE_TYPE.FREE
      ? { type: STATE_TYPE.ENTER_PIE, duration: 1000, time: 0 }
      : state
  }
}

interface TransitionProps {
  prev?: Omit<State, 'time'>
  next?: Omit<State, 'time'>
}

interface TransitionState {
  (state: State): State
}

const TRANSITION_STATES: Partial<Record<STATE_TYPE, TransitionState>> = {
  [STATE_TYPE.ENTER_PIE]: makeTransitionState({
    next: { type: STATE_TYPE.OVERLAY_PIE, duration: 1000 },
    prev: { type: STATE_TYPE.FREE,        duration: 0 },
  }),
  [STATE_TYPE.OVERLAY_PIE]: makeTransitionState({
    next: { type: STATE_TYPE.EXIT_PIE, duration: 1000 },
    prev: { type: STATE_TYPE.ENTER_PIE, duration: 1000 },
  }),
  [STATE_TYPE.EXIT_PIE]: makeTransitionState({
    next: { type: STATE_TYPE.FREE, duration: 0 },
    prev: { type: STATE_TYPE.OVERLAY_PIE, duration: 1000 },
  }),
}

function makeTransitionState(props: TransitionProps): TransitionState {
  const { prev, next } = props

  return function transition(state: State): State {
    const { time, duration: outgoingDuration } = state
    if (time > outgoingDuration) {
      return next ? { ...next, time: time - outgoingDuration } : state
    } else if (time < 0) {
      return prev ? { ...prev, time: outgoingDuration - time } : state
    } else {
      return state
    }
  }
}

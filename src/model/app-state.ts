export enum STATE_TYPE {
  FREE              = 'free',
  ENTER_PIE         = 'enter-pie',
  ENTER_OVERLAY_PIE = 'enter-overlay-pie',
  PIE_OVERLAID      = 'pie-overlaid',
  EXIT_OVERLAY_PIE  = 'exit-overlay-pie',
  EXIT_PIE          = 'exit-pie',
}

export interface State {
  type:     STATE_TYPE
  duration: number
  time:     number
}

export type StateAction = JumpAction | IterateAction | TriggerPieAction

export enum STATE_ACTION_TYPE {
  TRIGGER_PIE = 'toggle-pie',
  JUMP       = 'jump',
  ITERATE    = 'iterate',
}

interface JumpAction {
  type:  typeof STATE_ACTION_TYPE.JUMP
  state: State
}

export function jump(state: State): JumpAction {
  return { type: STATE_ACTION_TYPE.JUMP, state }
}

interface IterateAction {
  type:      typeof STATE_ACTION_TYPE.ITERATE
  deltaTime: number
}

export function iterate(deltaTime: number): IterateAction {
  return { type: STATE_ACTION_TYPE.ITERATE, deltaTime }
}

interface TriggerPieAction {
  type: typeof STATE_ACTION_TYPE.TRIGGER_PIE
}

export function triggerPie(): TriggerPieAction {
  return { type: STATE_ACTION_TYPE.TRIGGER_PIE }
}

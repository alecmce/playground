export enum STATE_TYPE {
  FREE                    = 'free',
  BAR_CHART_CONFIG        = 'bar-chart-config',
  CARROLL_DIAGRAM_CONFIG  = 'carroll-diagram-config',
  PIE_CHART_CONFIG        = 'pie-chart-config',
  ENTER_PLACES            = 'enter-places',
  ENTER_OVERLAY           = 'enter-overlay',
  FULL_OVERLAY            = 'pie-overlaid',
  EXIT_OVERLAY            = 'exit-overlay',
  LEAVE_PLACES            = 'leave-places',
  CLOSE_CHART             = 'close-chart',
}

export enum CHART_TYPE {
  BAR_CHART       = 'bar-chart',
  CARROLL_DIAGRAM = 'carroll-diagram',
  PIE_CHART       = 'pie-chart',
}

export interface AppState {
  type:      STATE_TYPE
  duration:  number
  time:      number
  isPaused?: boolean
  chart?:    CHART_TYPE
}

export type AppStateAction = JumpAction | IterateAction | TriggerPieAction | TogglePauseAction

export enum STATE_ACTION_TYPE {
  TRIGGER_PIE  = 'toggle-pie',
  TOGGLE_PAUSE = 'toggle-pause',
  JUMP         = 'jump',
  ITERATE      = 'iterate',
}

interface JumpAction {
  type:  typeof STATE_ACTION_TYPE.JUMP
  state: Omit<AppState, 'duration'>
}

export function jump(state: Omit<AppState, 'duration'>): JumpAction {
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

interface TogglePauseAction {
  type: typeof STATE_ACTION_TYPE.TOGGLE_PAUSE
}

export function togglePause(): TogglePauseAction {
  return { type: STATE_ACTION_TYPE.TOGGLE_PAUSE }
}

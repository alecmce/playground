import { Point } from './geometry'

export interface InteractionHandlers<T> {
  isOver:  (point: Point) => T | null
  onDown:  (point: Point, item: T | null) => boolean // isDrag
  onDrag:  (down: Point, current: Point, item: T) => void
  onDrop:  (down: Point, current: Point, item: T) => void
  onMove:  (point: Point) => void
  onHover: (point: Point, item: T | null) => void
  onUp:    (point: Point, item: T | null) => void
}

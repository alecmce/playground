import { useMemo, useRef } from 'react'
import { Point } from 'src/model/geometry'

interface Props<T> {
  isOver:  (point: Point) => T | null
  onDown:  (point: Point, item: T | null) => boolean // isDrag
  onDrag:  (down: Point, current: Point, item: T) => void
  onDrop:  (down: Point, current: Point, item: T) => void
  onMove:  (point: Point) => void
  onHover: (point: Point, item: T | null) => void
  onUp:    (point: Point, item: T | null) => void
}

interface State<T> {
  down:   Point | null
  item:   T | null
  isDrag: boolean
}

export function usePointerHandlers<T>(props: Props<T>): void {
  const { isOver, onDown, onDrag, onDrop, onHover, onMove, onUp } = props

  const state = useRef<State<T>>({
    down: null,
    item: null,
    isDrag: false,
  })

  useMemo(() => {
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerdown', onPointerDown)

    return function unmount(): void {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
    }

    function onPointerMove(event: PointerEvent): void {
      const point = getPoint(event)
      onMove(point)

      if (state.current.isDrag) {
        onDrag(state.current.down!, point, state.current.item!)
      } else {
        state.current.item = isOver(point)
        onHover(point, state.current.item)
      }
    }

    function onPointerDown(event: PointerEvent): void {
      const point = getPoint(event)

      window.addEventListener('pointerup', onPointerUp)
      state.current.down = point
      state.current.isDrag = onDown(point, state.current.item)
    }

    function onPointerUp(event: PointerEvent): void {
      const point = getPoint(event)
      window.removeEventListener('pointerup', onPointerUp)

      if (state.current.isDrag) {
        state.current.isDrag = false
        onDrop(state.current.down!, point, state.current.item!)
      } else {
        onUp(point, state.current.item)
      }

      state.current.down = null
    }

    function getPoint(event: PointerEvent): Point {
      return { x: event.clientX, y: event.clientY }
    }
  }, [onDown, onDrag, onDrop, onHover, onUp, state])
}

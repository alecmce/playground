import { useMemo, useRef } from 'react'
import { Point } from 'src/model/geometry'
import { InteractionHandlers } from 'src/model/interaction-handlers'

interface Props<T> {
  handlers: InteractionHandlers<T> | undefined
}

interface State<T> {
  down:   Point | null
  isDrag: boolean
  item:   T | null
}

export function usePointerHandlers<T>(props: Props<T>): void {
  const { handlers } = props

  const state = useRef<State<T>>({ down: null, isDrag: false, item: null })

  useMemo(() => {
    return handlers
      ? makePointerHandlers(handlers)
      : undefined

    function makePointerHandlers(handlers: InteractionHandlers<T>): VoidFunction {
      const { isOver, onDown, onDrag, onDrop, onHover, onMove, onUp } = handlers

      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerdown', onPointerDown)

      return function unmount(): void {
        state.current = { down: null, isDrag: false, item: null }
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
    }
  }, [handlers, state])
}

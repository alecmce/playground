import { Dispatch, SetStateAction, useMemo, useRef } from 'react'
import { Chart } from 'src/model/charts'
import { Creature } from 'src/model/creatures'
import { Point } from 'src/model/geometry'
import { POINTER_ACTION } from 'src/model/interaction'
import { usePointerHandlers } from './use-pointer-handlers'

interface Props {
  chart:      Chart | undefined
  creatures:  Creature[]
  enabled:    boolean
  setPointer: Dispatch<SetStateAction<Point | null>>
  setTarget:  Dispatch<SetStateAction<Creature | null>>
}

const NULL_HANDLERS = {
  isOver:  () => null,
  onDown:  () => false,
  onDrag:  () => void 0,
  onDrop:  () => void 0,
  onHover: () => void 0,
  onMove:  () => void 0,
  onUp:    () => void 0,
}

export function useCreaturesDrag(props: Props): void {
  const { chart, creatures, enabled, setPointer, setTarget } = props

  const initial = useRef<Point>({ x: 0, y: 0 })

  const handlers = useMemo(() => {
    return enabled
      ? { isOver, onDown, onDrag, onDrop, onHover, onMove, onUp }
      : NULL_HANDLERS

    function isOver(pointer: Point): Creature | null {
      return creatures.find(c => c.isUnder(pointer)) ?? null
    }

    function onDown(point: Point, target: Creature | null): boolean {
      if (target) {
        initial.current.x = target.center.x
        initial.current.y = target.center.y
      }
      chart?.setPointer(point, POINTER_ACTION.DOWN)
      return isOver(point) !== null
    }

    function onHover(_: Point, target: Creature | null): void {
      setTarget(target)
    }

    function onMove(point: Point): void {
      setPointer(point)
      chart?.setPointer(point, POINTER_ACTION.MOVE)
    }

    function onUp(point: Point): void {
      chart?.setPointer(point, POINTER_ACTION.UP)
    }

    function onDrag(start: Point, current: Point, target: Creature | null): void {
      setPointer(current)
      if (target) {
        target.center.x = initial.current.x + current.x - start.x
        target.center.y = initial.current.y + current.y - start.y
      }
    }

    function onDrop(): void {

    }
  }, [chart, enabled, setPointer, setTarget, initial])

  usePointerHandlers<Creature | null>(handlers)
}

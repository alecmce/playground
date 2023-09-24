import { Dispatch, SetStateAction, useMemo, useRef } from 'react'
import { Chart } from 'src/model/charts'
import { Creature } from 'src/model/creatures'
import { Point } from 'src/model/geometry'
import { usePointerHandlers } from './use-pointer-handlers'
import { POINTER_ACTION } from 'src/model/interaction'

interface Props {
  chart:      Chart | undefined
  creatures:  Creature[]
  setPointer: Dispatch<SetStateAction<Point | null>>
  setTarget:  Dispatch<SetStateAction<Creature | null>>
}

export function useCreaturesDrag(props: Props): void {
  const { chart, creatures, setPointer, setTarget } = props

  const initial = useRef<Point>({ x: 0, y: 0 })

  const handlers = useMemo(() => {
    return { isOver, onDown, onDrag, onDrop, onHover, onMove, onUp }

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
  }, [chart, setPointer, setTarget, initial])

  return usePointerHandlers<Creature | null>(handlers)
}

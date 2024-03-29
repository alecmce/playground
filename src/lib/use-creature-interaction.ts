import { Dispatch, SetStateAction, useMemo, useRef } from 'react'
import { Chart } from 'src/model/charts'
import { Creature } from 'src/model/creatures'
import { Point } from 'src/model/geometry'
import { POINTER_ACTION } from 'src/model/interaction'
import { InteractionHandlers } from 'src/model/interaction-handlers'
import { Puzzle } from 'src/model/puzzle'
import { usePointerHandlers } from './use-pointer-handlers'

interface Props {
  chart:      Chart<any> | undefined
  creatures:  Creature[] | undefined
  enabled:    boolean
  onClick?:   (creature: Creature | null) => void
  puzzle:     Puzzle | null
  setPointer: Dispatch<SetStateAction<Point | null>>
  setTarget:  Dispatch<SetStateAction<Creature | null>>
}

const NULL_HANDLERS: InteractionHandlers<Creature | null> = {
  isOver:  () => null,
  onDown:  () => void 0,
  onDrag:  () => void 0,
  onDrop:  () => void 0,
  onHover: () => void 0,
  onMove:  () => false,
  onUp:    () => void 0,
}

export function useCreatureInteraction(props: Props): void {
  const { chart, creatures, enabled, onClick, puzzle, setPointer, setTarget } = props

  const initial = useRef<Point>({ x: 0, y: 0 })

  const handlers = useMemo(() => {
    return creatures && enabled
      ? makeDragHandler(creatures)
      : NULL_HANDLERS

    function makeDragHandler(creatures: Creature[]): InteractionHandlers<Creature | null> {
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

      function onMove(point: Point): boolean {
        setPointer(point)
        chart?.setPointer(point, POINTER_ACTION.MOVE)
        return true
      }

      function onUp(point: Point): void {
        chart?.setPointer(point, POINTER_ACTION.UP)
        console.log('onUp', point)
        onClick?.(isOver(point))
      }

      function onDrag(start: Point, current: Point, target: Creature | null): void {
        setPointer(current)
        if (target) {
          target.center.x = initial.current.x + current.x - start.x
          target.center.y = initial.current.y + current.y - start.y
        }
      }

      function onDrop(down: Point, current: Point, target: Creature | null): void {
        if (puzzle && target) {
          puzzle.onDrop(down, current, target)
        }
      }
    }
  }, [chart, creatures, enabled, initial, puzzle, setPointer, setTarget])

  usePointerHandlers<Creature | null>({ handlers })
}

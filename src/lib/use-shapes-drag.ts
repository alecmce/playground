import { Dispatch, SetStateAction, useMemo, useRef } from 'react'
import { Point, Positions } from 'src/model/geometry'
import { getDistance } from './math-utils'
import { usePointerHandlers } from './use-pointer-handlers'

interface Props {
  positions:    Positions
  radius:       number
  clampPoint:   (point: Point) => void
  setPositions: Dispatch<SetStateAction<Positions>>
  setPointer:   Dispatch<SetStateAction<Point | null>>
  setTarget:    Dispatch<SetStateAction<Point | null>>
}

export function useShapesDrag(props: Props): void {
  const { clampPoint, positions, radius, setPointer, setPositions, setTarget } = props
  const { points } = positions

  const initial = useRef<Point>({ x: 0, y: 0 })

  const handlers = useMemo(() => {
    return { isOver, onDown, onDrag, onDrop, onHover, onMove, onUp }

    function isOver(pointer: Point): Point | null {
      return points.find(p => getDistance(p, pointer) < radius) ?? null
    }

    function onDown(pointer: Point, target: Point | null): boolean {
      if (target) {
        initial.current.x = target.x
        initial.current.y = target.y
      }
      return isOver(pointer) !== null
    }

    function onHover(_: Point, target: Point | null): void {
      setTarget(target)
    }

    function onMove(point: Point): void {
      setPointer(point)
    }

    function onUp(): void {

    }

    function onDrag(start: Point, current: Point, target: Point | null): void {
      setPointer(current)
      if (target) {
        target.x = initial.current.x + current.x - start.x
        target.y = initial.current.y + current.y - start.y
        clampPoint(target)
        setPositions(p => ({ ...p, version: p.version + 1 }))
      }
    }

    function onDrop(): void {

    }
  }, [setPointer, setPositions, setTarget, initial])

  return usePointerHandlers<Point | null>(handlers)
}

import { Dispatch, SetStateAction, useMemo } from 'react'
import { Point } from 'src/model/geometry'
import { getDistance } from './math-utils'
import { usePointerHandlers } from './use-pointer-handlers'

interface Props {
  points:    Point[]
  radius:    number
  setTarget: (target: Point | null) => void
  setPoints: Dispatch<SetStateAction<Point[]>>
}

export function useShapesDrag(props: Props): void {
  const { points, radius, setPoints, setTarget } = props

  const handlers = useMemo(() => {
    return { isOver, onDown, onDrag, onDrop, onHover, onMove, onUp }

    function isOver(pointer: Point): Point | null {
      return points.find(p => getDistance(p, pointer) < radius) ?? null
    }

    function onDown(pointer: Point): boolean {
      return isOver(pointer) !== null
    }

    function onHover(_: Point, target: Point | null): void {
      setTarget(target)
    }

    function onMove(): void {

    }

    function onUp(): void {

    }

    function onDrag(start: Point, current: Point, target: Point | null): void {
      if (target) {
        const offset = { x: target.x + current.x - start.x, y: target.y + current.y - start.y }
        setPoints(points.map(p => p === target ? offset : p))
        setTarget(offset)
      }
    }

    function onDrop(): void {

    }
  }, [setPoints, setTarget])

  return usePointerHandlers<Point | null>(handlers)
}

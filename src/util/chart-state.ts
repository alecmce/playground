import { Point } from 'src/model/geometry'
import { POINTER_ACTION } from 'src/model/interaction'

interface Props<T> {
  getItem: (point: Point) => T | null
}

interface ChartState<T> {
  reset:    VoidFunction
  getAlpha: (item: T) => number
  update:   (point: Point, action: POINTER_ACTION) => void
}

export function makeChartState<T>(props: Props<T>): ChartState<T> {
  const { getItem } = props

  const set = new Set<T>()
  let current: T | null = null
  let toggle = false

  return { reset, getAlpha, update }

  function reset(): void {
    current = null
    set.clear()
  }

  function getAlpha(item: T): number {
    return set.has(item)
      ? 0
      : (item === current ? 0.2 : 1)
  }

  function update(point: Point, action: POINTER_ACTION): void {
    const item = getItem(point)

    switch (action) {
      case POINTER_ACTION.DOWN: return toggleItem(item)
      case POINTER_ACTION.MOVE: return setCurrent(item)
      case POINTER_ACTION.UP:   return resetToggle()
    }

    function setCurrent(item: T | null): void {
      if (item !== current) {
        current = item
        toggle = false
      }
    }

    function toggleItem(item: T | null): void {
      if (item && !toggle) {
        toggle = true
        set.has(item)
          ? set.delete(item)
          : set.add(item)
      }
    }

    function resetToggle(): void {
      toggle = false
    }
  }
}

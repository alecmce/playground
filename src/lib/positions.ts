import { useMemo } from 'react'
import { Point, Positions } from 'src/model/geometry'

interface Props {
  count:   number
  radius:  number
  height:  number
  width:   number
}

export function usePositions(props: Props): Positions {
  const { count, height, radius, width } = props

  return useMemo(() => makePositions({ count, height, radius, width }), [count])
}

export function makePositions(props: Props): Positions {
  const { count, height, radius, width } = props

  const points = Array.from({ length: count }, makeInitialPoint)
  return { points, version: 0 }

  function makeInitialPoint(): Point {
    const x = Math.random() * (width - 2 * radius) + radius
    const y = Math.random() * (height - 2 * radius) + radius
    return { x, y }
  }
}

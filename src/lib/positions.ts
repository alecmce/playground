import { useMemo } from 'react'
import { Point, Positions } from 'src/model/geometry'
import { Size } from 'src/model/values'

interface Props {
  count:   number
  radius:  number
  size:    Size
}

export function usePositions(props: Props): Positions {
  const { count, radius, size } = props

  return useMemo(() => makePositions({ count, radius, size }), [count])
}

export function makePositions(props: Props): Positions {
  const { count, radius, size } = props
  const { height, width } = size

  const points = Array.from({ length: count }, makeInitialPoint)
  return { points, version: 0 }

  function makeInitialPoint(): Point {
    const x = Math.random() * (width - 2 * radius) + radius
    const y = Math.random() * (height - 2 * radius) + radius
    return { x, y }
  }
}

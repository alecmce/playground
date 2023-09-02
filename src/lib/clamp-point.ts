import { useCallback } from 'react'
import { Point } from 'src/model/geometry'
import { clamp } from './math-utils'

interface Props {
  height: number
  width:  number
  radius: number
}

export function useClampPoint(props: Props): (point: Point) => void {
  const { height, width, radius } = props

  return useCallback((point: Point): void => {
    point.x = clamp(point.x, radius, width - radius)
    point.y = clamp(point.y, radius, height - radius)
  }, [width, height, radius])
}

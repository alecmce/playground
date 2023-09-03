import { useCallback, useEffect, useRef } from 'react'
import { Point } from 'src/model/geometry'
import { Size } from 'src/model/values'
import { clamp } from './math-utils'

interface Props {
  size:   Size
  radius: number
}

export function useClampPoint(props: Props): (point: Point) => void {
  const { size, radius } = props

  const ref = useRef<Size>(size)

  useEffect(() => {
    ref.current = size
  }, [size])

  return useCallback((point: Point): void => {
    const { height, width } = ref.current
    point.x = clamp(point.x, radius, width - radius)
    point.y = clamp(point.y, radius, height - radius)
  }, [radius, size])
}

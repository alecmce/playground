import { useMemo } from 'react'
import { Brush } from 'src/model/drawing'

interface Props {
  brush:  Brush
  radius: number
}

export function useBaseBrush(props: Props): Brush {
  const { brush, radius } = props
  return useMemo(() => makeBaseBrush(props), [brush, radius])
}

const UNIT_SCALAR = 60

export function makeBaseBrush(props: Props): Brush {
  const { brush, radius } = props
  const scalar = Math.min(1, radius / UNIT_SCALAR)
  return scalar < 1
    ? { ...brush, width: brush.width * scalar }
    : brush
}

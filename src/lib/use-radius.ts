import { useMemo } from 'react'
import { Size } from 'src/model/values'

interface Props {
  count:   number
  density: number
  size:    Size
}

export function useRadius(props: Props): number {
  const { count, size, density } = props

  return useMemo(() => getRadius({ count, size, density }), [count, size, density])
}

function getRadius(props: Props): number {
  const { count, density, size } = props
  const { height, width } = size
  return density * Math.sqrt((width * height) / (Math.PI * count))
}

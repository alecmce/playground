import { useMemo } from 'react'

interface Props {
  count:   number
  density: number
  height:  number
  width:   number
}

export function useRadius(props: Props): number {
  const { count, height, width, density } = props

  return useMemo(() => getRadius({ count, height, width, density }), [count, height, width, density])
}

function getRadius(props: Props): number {
  const { count, density, height, width } = props
  return density * Math.sqrt((width * height) / (Math.PI * count))
}

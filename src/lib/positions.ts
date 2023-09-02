import { Point, Positions } from 'src/model/geometry'

interface Props {
  count:   number
  density: number
  height:  number
  width:   number
}

export function makePositions(props: Props): Positions {
  const { count, height, width } = props

  const radius = getRadius(props)
  const points = Array.from({ length: count }, makeInitialPoint)
  return { points, radius, version: 0 }

  function makeInitialPoint(): Point {
    const x = Math.random() * (width - 2 * radius) + radius
    const y = Math.random() * (height - 2 * radius) + radius
    return { x, y }
  }
}

function getRadius(props: Props): number {
  const { count, density, height, width } = props
  return density * Math.sqrt((width * height) / (Math.PI * count))
}

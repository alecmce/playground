import { Point } from 'src/model/geometry'

interface Props {
  count:       number
  radius:      number
  center:      Point
  maxDistance: number
}

interface RingOfPoints {
  points: Point[]
  scale:  number
  radius: number
}

/**
 * Generates a ring of points around the origin such that circles with the given radius at those points touch but do not
 * intersect.
 */
export function makeRingOfPoints(props: Props): RingOfPoints {
  const { center, count, maxDistance, radius: inputRadius } = props

  const theta = 2 * Math.PI / count
  const start = -Math.PI / 2 - theta / 2
  const unScaledDistance = inputRadius / Math.sin(theta / 2)
  const distance = Math.min(maxDistance, inputRadius / Math.sin(theta / 2))
  const scale = distance / unScaledDistance

  const points = Array.from({ length: count }, makePoint)
  const radius = inputRadius * scale

  return { points, radius, scale }

  function makePoint(_: unknown, index: number): Point {
    const angle = start + index * theta
    const x = center.x + distance * Math.cos(angle)
    const y = center.y + distance * Math.sin(angle)
    return { x, y }
  }
}

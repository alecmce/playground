import { Point, Polygon } from 'src/model/geometry'

interface Props {
  center:    Point
  radius:    number
  rotation?: number
  sides:     number
}

export function makeRegularPolygon(props: Props): Polygon {
  const { center, radius, rotation = 0, sides } = props
  const delta = 2 * Math.PI / sides

  return Array.from({ length: sides }, getPoint)

  function getPoint(_: unknown, index: number): Point {
    const angle = delta * index + rotation
    const x = center.x + Math.cos(angle) * radius
    const y = center.y + Math.sin(angle) * radius
    return { x, y }
  }
}

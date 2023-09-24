import { Point, Rectangle } from 'src/model/geometry'

interface Props {
  point:     Point
  rectangle: Rectangle
}

export function rectangleContainsPoint(props: Props): boolean {
  const { point, rectangle } = props
  const { x, y } = point
  const { left, right, top, bottom } = rectangle

  return x >= left && x <= right && y >= top && y <= bottom
}

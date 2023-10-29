import { Circle, Rectangle } from 'src/model/geometry'


interface Props {
  count:     number
  rectangle: Rectangle
}

interface RadiusForDivisions {
  radius:    number
  divisions: number
}

export function makeRectangleCircles(props: Props): Circle[] {
  const { count, rectangle } = props

  const {left, right, top, bottom} = rectangle
  const width = Math.abs(right - left)
  const height = Math.abs(bottom - top)

  const longestSide = Math.max(width, height)
  const ratio = longestSide / Math.min(width, height)

  const { radius, divisions } = Array.from({ length: count }, (_, i) => i + 1)
    .map(getRadiusForDivisions)
    .sort(byRadius)
    .at(0)!

  return Array.from({ length: count }).map(makeCircle)

  // nth member of the Fibonacci sequence r(n) = R(0) * n^0.5; and theta(n) = n•theta(0).
  function makeCircle(_: unknown, index: number): Circle {
    const ix = index % divisions
    const iy = Math.floor(index / divisions)
    const x = left + radius * (ix * 2 + 1)
    const y = top + radius * (iy + 1) * 2
    return { center: { x, y }, radius }
  }

  function getRadiusForDivisions(divisions: number): RadiusForDivisions {
    const longest = longestSide / divisions
    const shortest = Math.ceil(longest / ratio)

    const longRadius = longest / 2
    const shortRadius = (shortest + 1) / 2
    return { radius: Math.min(longRadius, shortRadius), divisions }
  }
}

function byRadius(a: RadiusForDivisions, b: RadiusForDivisions): number {
  return b.radius - a.radius
}

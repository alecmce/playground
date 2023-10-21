import { makeFibonacciCircles } from 'src/lib/fibonacci-circles'
import { Circle } from 'src/model/geometry'

interface Props {
  first:  Circle
  second: Circle
  count:  number
}

export interface VennCircles {
  first:        Circle[]
  second:       Circle[]
  intersection: Circle[]
  excluded:     Circle[]
}

interface SubVennCircles {
  first:        Circle[]
  intersection: Circle[]
}

export function makeVennCircles(props: Props): VennCircles {
  const {
    count,
    first: { center: { x: fx, y: fy } },
    second: { center: { x: sx, y: sy }, radius },
  } = props

  let order = Math.round(Math.log2(count))
  let circles = getCircles(Math.pow(2, order))
  while (circles.first.length < count || circles.intersection.length < count) {
    order++
    circles = getCircles(Math.pow(2, order))
  }

  let upperBound = Math.pow(2, order)
  let lowerBound = Math.pow(2, order - 1)
  while (upperBound - lowerBound > 1) {
    const mid = Math.floor((upperBound + lowerBound) / 2)
    circles = getCircles(mid)
    if (circles.first.length >= count && circles.intersection.length >= count) {
      upperBound = mid
    } else {
      lowerBound = mid
    }
  }

  const { first, intersection } = circles
  const second = first.map(toSecondCircle)
  const excluded = getExcluded()
  return { first, intersection, second, excluded }

  function getCircles(count: number): SubVennCircles {
    const circles = makeFibonacciCircles({ center: { x: fx, y: fy }, count, radius })
    const intersection = circles.filter(isInsideOtherCircle)
    const first = circles.filter(isOutsideOtherCircle)
    return { first, intersection }
  }

  function isInsideOtherCircle(circle: Circle): boolean {
    const { center: { x, y }, radius: cRadius } = circle
    return Math.hypot(x - sx, y - sy) < radius - cRadius
  }

  function isOutsideOtherCircle(circle: Circle): boolean {
    const { center: { x, y }, radius: cRadius } = circle
    return Math.hypot(x - sx, y - sy) > radius + cRadius
  }

  function toSecondCircle(circle: Circle): Circle {
    const { center: { x, y }, radius } = circle
    const dx = fx - x
    const dy = fy - y
    return { center: { x: sx + dx, y: sy + dy }, radius }
  }

  function getExcluded(): Circle[] {
    const cRadius = getRadius()
    const bRadius = radius + cRadius
    const theta = 2 * Math.asin(cRadius / bRadius)
    const start = -5 * Math.PI / 8
    const count = Math.floor(Math.PI / theta)

    return Array.from({ length: count }, (_, i) => {
      const angle = start - theta * i
      const dx = Math.cos(angle) * bRadius
      const dy = Math.sin(angle) * bRadius
      return [
        { center: { x: fx + dx, y: fy + dy }, radius: cRadius },
        { center: { x: sx - dx, y: sy + dy }, radius: cRadius }
      ]
    }).flat()
  }

  function getRadius(): number {
    const template = first[0] ?? intersection[0]
    return template ? template.radius : getEdgeCaseRadius()
  }

  function getEdgeCaseRadius(): number {
    const theta = 2 * Math.PI / count
    const value = Math.sin(theta / 2)
    return (-radius * value) / (value - 1)
  }
}

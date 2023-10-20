import { Circle, Point } from 'src/model/geometry'


interface Props {
  center?: Point
  count:   number
  radius:  number
}

const PHI = (1 + Math.sqrt(5)) / 2
const THETA = (2 * Math.PI) / (PHI * PHI)

export function makeFibonacciCircles(props: Props): Circle[] {
  const { center: { x, y } = { x: 0, y: 0 }, count, radius: outerRadius } = props

  const scalarRadius = outerRadius / (Math.sqrt(count + 1) + 1)
  const radius = scalarRadius * PHI / 2

  return Array.from({ length: count }, makeCircle)

  // nth member of the Fibonacci sequence r(n) = R(0) * n^0.5; and theta(n) = n•theta(0).
  function makeCircle(_: unknown, index: number): Circle {
    const i = index + 1
    const r = scalarRadius * Math.sqrt(i)
    const theta = i * THETA
    const center = { x: x + r * Math.cos(theta), y: y + r * Math.sin(theta) }
    return { center, radius }
  }
}

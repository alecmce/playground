import { Point } from 'src/model/geometry'
import { clamp } from './math-utils'

interface Props {
  height:  number
  points:  Point[]
  radius:  number
  width:   number
  scalar?: number
}

interface PushApart {
  isForceApplied: boolean
  points:         Point[]
}

export function pushApart(props: Props): PushApart {
  const { height, points: inputs, radius, width, scalar = 0.001 } = props
  let isForceApplied = false

  const pairs = makePairs(inputs)
  const forces = new Map(inputs.map(p => [p, { x: 0, y: 0 }]))
  pairs.forEach(gatherForce)
  const points = isForceApplied ? inputs.map(applyForce) : inputs
  return { isForceApplied, points }

  function gatherForce([a, b]: [Point, Point]): void {
    const forceA = forces.get(a)!
    const forceB = forces.get(b)!

    const dx = b.x - a.x
    const dy = b.y - a.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    const delta = distance - 2 * radius
    if (delta < 0) {
      isForceApplied = true
      const force = delta * scalar
      const fx = force * dx / delta
      const fy = force * dy / delta
      forceA.x -= fx
      forceA.y -= fy
      forceB.x += fx
      forceB.y += fy
    }
  }

  function applyForce(point: Point): Point {
    const force = forces.get(point)!
    return force.x !== 0 || force.y !== 0
      ? apply()
      : point

    function apply(): Point {
      const x = clamp(point.x + force.x, radius, width - radius)
      const y = clamp(point.y + force.y, radius, height - radius)
      return { x, y }
    }
  }
}

function makePairs(points: Point[]): [Point, Point][] {
  const pairs: [Point, Point][] = []
  for (let i = 0; i < points.length; i++) {
    const a = points[i]
    for (let j = i + 1; j < points.length; j++) {
      const b = points[j]
      pairs.push([a, b])
    }
  }
  return pairs
}

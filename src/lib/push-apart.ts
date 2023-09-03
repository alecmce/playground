import { Point, Positions } from 'src/model/geometry'
import { clamp } from './math-utils'

interface Props {
  height:    number
  positions: Positions
  radius:    number
  width:     number
  scalar?:   number
}

export function pushApart(props: Props): Positions {
  const { height, positions, radius, scalar = 0.001, width } = props
  const { points, version } = positions
  let isForceApplied = false

  const pairs = makePairs(points)
  const forces = new Map(points.map(p => [p, { x: 0, y: 0 }]))
  pairs.forEach(gatherForce)

  if (isForceApplied) {
    points.forEach(applyForce)
    return { ...positions, version: version + 1 }
  } else {
    return positions
  }

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

  function applyForce(point: Point): void {
    const force = forces.get(point)!
    point.x = clamp(point.x + force.x, radius, width - radius)
    point.y = clamp(point.y + force.y, radius, height - radius)
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

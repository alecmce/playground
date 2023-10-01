import { Creature } from 'src/model/creatures'
import { Point } from 'src/model/geometry'
import { PushApart, PushApartProps } from 'src/model/push-apart'
import { makePairs } from './array-util'
import { quadIn } from './ease'


export function makePushApart(creatures: Creature[]): PushApart {
  const pairs = makePairs(creatures)
  const forces = new Map<Creature, Point>(creatures.map(p => [p, { x: 0, y: 0 }]))

  let ease = 0

  return function pushApart(props: PushApartProps): void {
    const { radius, scalar = 0.001 } = props
    let isForceApplied = false

    ease = Math.min(ease + 0.01, 1)
    const easeScalar = quadIn(ease)

    forces.forEach(reset)
    pairs.forEach(gatherForce)

    if (isForceApplied) {
      creatures.forEach(apply)
    }

    function reset(force: Point): void {
      force.x = 0
      force.y = 0
    }

    function gatherForce([a, b]: [Creature, Creature]): void {
      const forceA = forces.get(a)!
      const forceB = forces.get(b)!

      const dx = b.center.x - a.center.x
      const dy = b.center.y - a.center.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      const delta = distance - 2 * radius
      if (delta < 0) {
        isForceApplied = true
        const force = delta * scalar
        const fx = easeScalar * force * dx / delta
        const fy = easeScalar * force * dy / delta
        forceA.x -= fx
        forceA.y -= fy
        forceB.x += fx
        forceB.y += fy
      }
    }

    function apply(creature: Creature): void {
      const force = forces.get(creature)!
      const { center } = creature
      center.x += force.x
      center.y += force.y
    }
  }
}

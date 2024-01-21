import { Creature } from 'src/model/creatures'
import { Point } from 'src/model/geometry'

export interface Walks {
  add:     (creature: Creature, target: Point) => void
  update:  VoidFunction
  dispose: VoidFunction
}

const SPEED = 10

export function makeWalks(): Walks {
  const walks = new Map<Creature, VoidFunction>()

  return { add, dispose, update }

  function add(creature: Creature, target: Point): void {
    walks.set(creature, makeWalk({ creature, remove, target }))
  }

  function remove(creature: Creature): void {
    walks.delete(creature)
  }

  function dispose(): void {
    walks.clear()
  }

  function update(): void {
    walks.forEach(update => update())
  }
}

interface WalkProps {
  creature: Creature
  remove:   (creature: Creature) => void
  target:   Point
}

function makeWalk(props: WalkProps): VoidFunction {
  const { creature, remove, target } = props

  const dx = target.x - creature.center.x
  const dy = target.y - creature.center.y
  let distance = Math.hypot(dx, dy)
  const sdx = SPEED * dx / distance
  const sdy = SPEED * dy / distance

  return function update(): void {
    const { center } = creature
    if (distance < SPEED) {
      creature.center = target
      remove(creature)
    } else {
      distance -= SPEED
      center.x += sdx
      center.y += sdy
    }
  }
}

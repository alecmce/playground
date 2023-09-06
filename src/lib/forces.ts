import { Creature } from 'src/model/creatures'
import { Point } from 'src/model/geometry'

export function applyForce(creature: Creature, force: Point): void {
  const { center } = creature
  center.x += force.x
  center.y += force.y
}

import { Assignment } from 'src/model/charts'
import { Creature } from 'src/model/creatures'
import { Point } from 'src/model/geometry'

interface Props<T extends Point, C> {
  categories: C
  creatures:  Creature[]
  places:     T[]
}

export function makePlaceAssignmentOptions<T extends Point, C>(props: Props<T, C>): Assignment<T, C>[] {
  const { categories, creatures, places } = props

  return places.flatMap(makePlaceAssignments)

  function makePlaceAssignments(place: T): Assignment<T, C>[] {
    const { x, y } = place

    return creatures.map(makeCreatureAssignment)

    function makeCreatureAssignment(creature: Creature): Assignment<T, C> {
      const { center } = creature
      const start = { ...center }
      const distance = Math.hypot(center.x - x, center.y - y)
      return { categories, creature, distance, place, start }
    }
  }
}

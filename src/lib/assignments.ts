import { Creature } from 'src/model/creatures'
import { Point } from 'src/model/geometry'
import { getDistance } from './math-utils'


interface Props {
  creatures: Creature[]
  places:    Point[]
  radius:    number
}

export interface PlaceAssignment {
  creature: Creature
  start:    Point
  place:    Point
  distance: number
}

/**
 * A naive algorithm to reduce long assignments, by first finding the creature with the longest trip to a place, then
 * assigning to it the closest available place; and then repeating.
 */
export function makeAssignments(props: Props): PlaceAssignment[] {
  const { creatures, places } = props

  const options = creatures
    .flatMap(makeCreatureOptions)
    .sort(sortDescending)

  const consumed = new Set<PlaceAssignment>()
  const assignments: PlaceAssignment[] = []

  options.forEach(assignOrSkip)
  return assignments

  function assignOrSkip(option: PlaceAssignment): void {
    const { creature } = option
    if (!consumed.has(option)) {
      const creatureOptions = filterOptions(o => o.creature === creature)
      const assigned = creatureOptions.at(-1)!
      assignments.push(assigned)
      const placeOptions = filterOptions(o => o.place === assigned.place)
      consumeOptions(creatureOptions)
      consumeOptions(placeOptions)
    }

    function filterOptions(fn: (option: PlaceAssignment) => boolean): PlaceAssignment[] {
      return options.filter(o => !consumed.has(o) && fn(o))
    }

    function consumeOptions(options: PlaceAssignment[]): void {
      options.forEach(o => consumed.add(o))
    }
  }

  function makeCreatureOptions(creature: Creature): PlaceAssignment[] {
    const { center } = creature
    const start = { ...center }

    return places.map(makeOption)

    function makeOption(place: Point): PlaceAssignment {
      return { creature, start, place, distance: getDistance(center, place) }
    }
  }

  function sortDescending(a: PlaceAssignment, b: PlaceAssignment): number {
    return b.distance - a.distance
  }

}

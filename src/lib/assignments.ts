import { CATEGORY, Categorized, Creature } from 'src/model/creatures'
import { Point } from 'src/model/geometry'
import { getDistance } from './math-utils'


interface Props {
  categorized: Categorized[]
  places:      Point[]
  radius:      number
}

export interface PlaceAssignment {
  categories: Partial<Record<CATEGORY, string | number>>
  creature:   Creature
  distance:   number
  place:      Point
  start:      Point
}

/**
 * A naive algorithm to reduce long assignments, by first finding the creature with the longest trip to a place, then
 * assigning to it the closest available place; and then repeating.
 */
export function makeAssignments(props: Props): PlaceAssignment[] {
  const { categorized, places } = props

  return assignOptions(makeOptions())

  function makeOptions(): PlaceAssignment[] {
    let placeIndex = 0
    return categorized
      .flatMap(makeCategoryOptions)
      .sort(sortDescending)

    function makeCategoryOptions(category: Categorized): PlaceAssignment[] {
      const { creatures, values: categories } = category

      const categoryPlaces = places.slice(placeIndex, placeIndex + creatures.length)
      placeIndex += creatures.length

      return creatures.flatMap(makeCreatureOptions)

      function makeCreatureOptions(creature: Creature): PlaceAssignment[] {
        const { center } = creature
        const start = { ...center }

        return categoryPlaces.map(makeOption)

        function makeOption(place: Point): PlaceAssignment {
          const distance = getDistance(center, place)
          return { categories, creature, distance, place, start }
        }
      }
    }

    function sortDescending(a: PlaceAssignment, b: PlaceAssignment): number {
      return b.distance - a.distance
    }
  }

  function assignOptions(options: PlaceAssignment[]): PlaceAssignment[] {
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
  }
}

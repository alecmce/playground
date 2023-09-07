import { CATEGORY, Categorized, Creature } from 'src/model/creatures'
import { ArcPlace, Point } from 'src/model/geometry'
import { getDistance } from './math-utils'


interface Props {
  categorized: Categorized[]
  places:      ArcPlace[]
  radius:      number
}

export interface Assignment {
  categories: Partial<Record<CATEGORY, string | number>>
  creature:   Creature
  distance:   number
  place:      ArcPlace
  start:      Point
}

/**
 * A naive algorithm to reduce long assignments, by first finding the creature with the longest trip to a place, then
 * assigning to it the closest available place; and then repeating.
 */
export function makeAssignments(props: Props): Assignment[] {
  const { categorized, places } = props

  return assignOptions(makeOptions())

  function makeOptions(): Assignment[] {
    let placeIndex = 0
    return categorized
      .flatMap(makeCategoryOptions)
      .sort(sortDescending)

    function makeCategoryOptions(category: Categorized): Assignment[] {
      const { creatures, values: categories } = category

      const categoryPlaces = places.slice(placeIndex, placeIndex + creatures.length)
      placeIndex += creatures.length

      return creatures.flatMap(makeCreatureOptions)

      function makeCreatureOptions(creature: Creature): Assignment[] {
        const { center } = creature
        const start = { ...center }

        return categoryPlaces.map(makeOption)

        function makeOption(place: ArcPlace): Assignment {
          const distance = getDistance(center, place)
          return { categories, creature, distance, place, start }
        }
      }
    }

    function sortDescending(a: Assignment, b: Assignment): number {
      return b.distance - a.distance
    }
  }

  function assignOptions(options: Assignment[]): Assignment[] {
    const consumed = new Set<Assignment>()
    const assignments: Assignment[] = []
    options.forEach(assignOrSkip)
    return assignments

    function assignOrSkip(option: Assignment): void {
      const { creature } = option
      if (!consumed.has(option)) {
        const creatureOptions = filterOptions(o => o.creature === creature)
        const assigned = creatureOptions.at(-1)!
        assignments.push(assigned)
        const placeOptions = filterOptions(o => o.place === assigned.place)
        consumeOptions(creatureOptions)
        consumeOptions(placeOptions)
      }

      function filterOptions(fn: (option: Assignment) => boolean): Assignment[] {
        return options.filter(o => !consumed.has(o) && fn(o))
      }

      function consumeOptions(options: Assignment[]): void {
        options.forEach(o => consumed.add(o))
      }
    }
  }
}

import { Assignment } from 'src/model/charts'
import { Categorized, Creature } from 'src/model/creatures'
import { Point } from 'src/model/geometry'
import { getDistance } from '../math-utils'


interface Props<T extends Point> {
  categorized: Categorized[]
  places:      T[]
  radius:      number
}

/**
 * A naive algorithm to reduce long assignments, by first finding the creature with the longest trip to a place, then
 * assigning to it the closest available place; and then repeating.
 */
export function makePieChartOptions<T extends Point>(props: Props<T>): Assignment<T>[] {
  const { categorized, places } = props

  let placeIndex = 0
  return categorized
    .flatMap(makeCategoryOptions)
    .sort(sortDescending)

  function makeCategoryOptions(category: Categorized): Assignment<T>[] {
    const { creatures, values: categories } = category

    const categoryPlaces = places.slice(placeIndex, placeIndex + creatures.length)
    placeIndex += creatures.length

    return creatures.flatMap(makeCreatureOptions)

    function makeCreatureOptions(creature: Creature): Assignment<T>[] {
      const { center } = creature
      const start = { ...center }

      return categoryPlaces.map(makeOption)

      function makeOption(place: T): Assignment<T> {
        const distance = getDistance(center, place)
        return { categories, creature, distance, place, start }
      }
    }
  }

  function sortDescending(a: Assignment<T>, b: Assignment<T>): number {
    return b.distance - a.distance
  }
}

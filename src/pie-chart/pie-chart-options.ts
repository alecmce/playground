import { Assignment } from 'src/model/charts'
import { Categorized, CategoryValues, Creature } from 'src/model/creatures'
import { ArcPlace } from 'src/model/geometry'
import { getDistance } from '../lib/math-utils'


interface Props {
  categorized: Categorized<CategoryValues>[]
  places:      ArcPlace[]
  radius:      number
}

/**
 * A naive algorithm to reduce long assignments, by first finding the creature with the longest trip to a place, then
 * assigning to it the closest available place; and then repeating.
 */
export function makePieChartOptions(props: Props): Assignment<ArcPlace, CategoryValues>[] {
  const { categorized, places } = props

  let placeIndex = 0
  return categorized
    .flatMap(makeCategoryOptions)
    .sort(sortDescending)

  function makeCategoryOptions(category: Categorized<CategoryValues>): Assignment<ArcPlace, CategoryValues>[] {
    const { creatures, values: categories } = category

    const categoryPlaces = places.slice(placeIndex, placeIndex + creatures.length)
    placeIndex += creatures.length

    return creatures.flatMap(makeCreatureOptions)

    function makeCreatureOptions(creature: Creature): Assignment<ArcPlace, CategoryValues>[] {
      const { center } = creature
      const start = { ...center }

      return categoryPlaces.map(makeOption)

      function makeOption(place: ArcPlace): Assignment<ArcPlace, CategoryValues> {
        const distance = getDistance(center, place)
        return { categories, creature, distance, place, start }
      }
    }
  }

  function sortDescending(a: Assignment<ArcPlace, CategoryValues>, b: Assignment<ArcPlace, CategoryValues>): number {
    return b.distance - a.distance
  }
}

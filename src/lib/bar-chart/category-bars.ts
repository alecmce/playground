import { Categorized, CategoryValues, Creature } from 'src/model/creatures'
import { Rectangle, RectanglePlace } from 'src/model/geometry'
import { Assignment } from '../assignments'

interface Props {
  bounds:      Rectangle
  categorized: Categorized[]
  horizontal?: boolean
  proportion?: number
}

export interface CategoryBars {
  categorized: CategorizedBarPlaces[]
  options:     Assignment<RectanglePlace>[]
  radius:      number
}

export interface CategorizedBarPlaces {
  places:    Rectangle[]
  options:   Assignment<RectanglePlace>[]
  rectangle: Rectangle
  values:    Partial<CategoryValues>
}

export function makeCategoryBars(props: Props): CategoryBars {
  const { bounds, categorized, proportion = 0.8 } = props

  const dWidth = Math.abs(bounds.right - bounds.left) / categorized.length
  const padding = (dWidth * (1 - proportion)) / 2
  const dHeight = Math.abs(bounds.bottom - bounds.top) / getLongestCategorySize()
  const radius = Math.min(dWidth - padding * 2, dHeight) / 2

  const bars = categorized.map(toCategoryBar)
  const options = bars.flatMap(b => b.options)

  return { categorized: bars, options, radius }

  function getLongestCategorySize(): number {
    return Math.max(...categorized.map(getCategoryLength))

    function getCategoryLength(category: Categorized): number {
      const { creatures } = category
      return creatures.length
    }
  }

  function toCategoryBar(categorized: Categorized, i: number): CategorizedBarPlaces {
    const { creatures, values } = categorized
    const { bottom } = bounds

    const height = (dHeight * creatures.length)
    const left = dWidth * i + padding
    const right = dWidth * (i + 1) - padding
    const x = (left + right) / 2
    const places = creatures.map(getPlace)
    const options = makeOptions(places)
    const rectangle = { left, right, top: bottom - height, bottom }

    return { places, values, rectangle, options }

    function getPlace(_: unknown, index: number): RectanglePlace {
      const y = bottom - dHeight * index - dHeight / 2
      const bounds = { bottom: y + dHeight / 2, left, right, top: y - dHeight / 2, x, y }
      return bounds
    }

    function makeOptions(places: RectanglePlace[]): Assignment<RectanglePlace>[] {
      return places.flatMap(makePlaceAssignments)

      function makePlaceAssignments(place: RectanglePlace): Assignment<RectanglePlace>[] {
        const { x, y } = place

        return creatures.map(makeCreatureAssignment)

        function makeCreatureAssignment(creature: Creature): Assignment<RectanglePlace> {
          const { center } = creature
          const start = { ...center }
          const distance = Math.hypot(center.x - x, center.y - y)
          return { categories: values, creature, distance, place, start }
        }
      }
    }
  }
}

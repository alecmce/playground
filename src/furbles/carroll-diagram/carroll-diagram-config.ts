import { makeRegularPolygon } from 'src/lib/regular-polygon'
import { Assignment } from 'src/model/charts'
import { Categorized, SetInclusionState, SetInclusionValues } from 'src/model/creatures'
import { Point, Polygon, Rectangle, RectanglePlace } from 'src/model/geometry'
import { getLongestCategorySize } from 'src/util/get-longest-category-size'
import { makePlaceAssignmentOptions } from 'src/util/make-place-assignment-options'

interface Props {
  bounds:      Rectangle
  first:       SetInclusionState
  second:      SetInclusionState
  categorized: Categorized<SetInclusionValues>[]
  horizontal?: boolean
  proportion?: number
}

export interface CarrollDiagramConfig {
  categorized: CarrollDiagramPlaces[]
  options:     Assignment<RectanglePlace, SetInclusionValues>[]
  radius:      number
  firstIcon:   DiagramIcon
  secondIcon:  DiagramIcon
}

interface DiagramIcon {
  center: Point
  radius: number
  color?: string
  eyes?:  string
  sides?: Polygon | null
}

export interface CarrollDiagramPlaces {
  places:    Rectangle[]
  options:   Assignment<RectanglePlace, SetInclusionValues>[]
  rectangle: Rectangle
  values:    SetInclusionValues
}

export function makeCarrollDiagramConfig(props: Props): CarrollDiagramConfig {
  const { bounds, categorized, first, proportion = 0.8, second } = props

  const boundsWidth = Math.abs(bounds.right - bounds.left)
  const boundsHeight = Math.abs(bounds.bottom - bounds.top)

  const width = proportion * boundsWidth / 2
  const height = proportion * boundsHeight / 2
  const longestCategory = getLongestCategorySize(categorized)

  const maxDiameter = Math.sqrt(width * height / longestCategory)
  const itemsPerRow = Math.floor(width / maxDiameter)

  const rows = Math.ceil(longestCategory / itemsPerRow)
  const radius = Math.min(width / itemsPerRow, height / rows) / 2

  const dWidth = width / itemsPerRow

  const leftActual = bounds.left + (boundsWidth - width * 2) / 2
  const topActual = bounds.top + (boundsHeight - height * 2) / 2

  const groups = categorized.map(toCategoryGroup)
  const options = groups.flatMap(b => b.options)

  const firstIcon = getFirstIconPlace()
  const secondIcon = getSecondIconPlace()

  return { categorized: groups, firstIcon, options, radius, secondIcon }

  function toCategoryGroup(categorized: Categorized<SetInclusionValues>, i: number): CarrollDiagramPlaces {
    const { creatures, values } = categorized

    const rowsForCategory = Math.ceil(creatures.length / itemsPerRow)
    const rowsHeight = rowsForCategory * 2 * radius
    const rowsOffset = (height - rowsHeight) / 2

    const left = leftActual + (i % 2) * width
    const top = topActual + Math.floor(i / 2) * height
    const right = left + width
    const bottom = top + height

    const places = creatures.map(getPlace)
    const options = makePlaceAssignmentOptions({ categories: values, creatures, places })
    const rectangle = { left, right, top: bottom - height, bottom }

    return { places, values, rectangle, options }

    function getPlace(_: unknown, index: number): RectanglePlace {
      const row = Math.floor(index / itemsPerRow)
      const column = getColumn(row, index)
      const x = left + dWidth / 2 + dWidth * column
      const y = top + rowsOffset + radius + 2 * radius * row
      return { bottom: y + radius, left: x - radius, right: x + radius, top: y - radius, x, y }
    }

    function getColumn(row: number, index: number): number {
      const isLastRow = row === rowsForCategory - 1
      return index % itemsPerRow + (isLastRow ? getOffsetForLastRow() : 0)
    }

    function getOffsetForLastRow(): number {
      const count = creatures.length % itemsPerRow
      return count === 0 ? 0 : (itemsPerRow - count) / 2
    }
  }

  function getFirstIconPlace(): DiagramIcon {
    const x = leftActual - radius * 1.2
    const y = topActual + height / 2
    const rotation = Math.random() * Math.PI * 2
    const sides = first.sides ? makeRegularPolygon({ radius, rotation, sides: parseInt(first.sides) }) : null
    return { ...first, center: { x, y }, radius, sides }
  }

  function getSecondIconPlace(): DiagramIcon {
    const x = leftActual + width / 2
    const y = topActual - radius * 1.2
    const rotation = Math.random() * Math.PI * 2
    const sides = second.sides ? makeRegularPolygon({ radius, rotation, sides: parseInt(second.sides) }) : null
    return { ...second, center: { x, y }, radius, sides }
  }
}

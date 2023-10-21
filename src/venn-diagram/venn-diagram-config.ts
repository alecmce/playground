import { makeRegularPolygon } from 'src/lib/regular-polygon'
import { Assignment } from 'src/model/charts'
import { CATEGORY_TYPE, Categorized, SetInclusionState, SetInclusionValues } from 'src/model/creatures'
import { Circle, Point, Polygon, Rectangle } from 'src/model/geometry'
import { getLongestCategorySize } from 'src/util/get-longest-category-size'
import { makePlaceAssignmentOptions } from 'src/util/make-place-assignment-options'
import { VennCircles, makeVennCircles } from './venn-circles'

interface Props {
  bounds:      Rectangle
  first:       SetInclusionState
  second:      SetInclusionState
  categorized: Categorized<SetInclusionValues>[]
  horizontal?: boolean
  proportion?: number
}

export interface VennDiagramConfig {
  categorized:  VennDiagramPlaces[]
  firstCircle:  Circle
  firstIcon:    DiagramIcon
  options:      Assignment<Point, SetInclusionValues>[]
  radius:       number
  secondCircle: Circle
  secondIcon:   DiagramIcon
  vennCircles?: VennCircles
}

interface DiagramIcon {
  center:       Point
  color?:       string
  eyes?:        string
  radius:       number
  sides?:       Polygon | null
}

export interface VennDiagramPlaces {
  places:  Point[]
  options: Assignment<Point, SetInclusionValues>[]
  values:  SetInclusionValues
}

export function makeVennDiagramConfig(props: Props): VennDiagramConfig {
  const { bounds, categorized, first, proportion = 0.8, second } = props

  const boundsWidth = Math.abs(bounds.right - bounds.left)
  const boundsHeight = Math.abs(bounds.bottom - bounds.top)

  const width = proportion * boundsWidth / 2

  const circleRadius = width * 0.45

  const center = { x: bounds.left + boundsWidth / 2, y: bounds.top + boundsHeight / 2 }

  const firstCircle = { radius: circleRadius, center: { x: center.x - circleRadius / 2, y: center.y } }
  const secondCircle = { radius: circleRadius, center: { x: center.x + circleRadius / 2, y: center.y } }

  const longestCategory = getLongestCategorySize(categorized)
  const vennCircles = makeVennCircles({ first: firstCircle, second: secondCircle, count: longestCategory })
  const radius = getRadius(vennCircles)

  const groups = categorized.map(toCategoryGroup)
  const options = groups.flatMap(b => b.options)

  const firstIcon = getIcon(firstCircle, first)
  const secondIcon = getIcon(secondCircle, second)

  return { categorized: groups, firstCircle, secondCircle, firstIcon, options, radius, secondIcon, vennCircles }

  function toCategoryGroup(categorized: Categorized<SetInclusionValues>): VennDiagramPlaces {
    const { creatures, values, type } = categorized

    const places = makePlaces()
    const options = makePlaceAssignmentOptions({ categories: values, creatures, places })
    return { places, values, options }

    function makePlaces(): Point[] {
      switch (type) {
        case CATEGORY_TYPE.FIRST:        return vennCircles.first.map(toPoint)
        case CATEGORY_TYPE.SECOND:       return vennCircles.second.map(toPoint)
        case CATEGORY_TYPE.INTERSECTION: return vennCircles.intersection.map(toPoint)
        default:                         return vennCircles.excluded.map(toPoint)
      }
    }
  }

  function getIcon(circle: Circle, state: SetInclusionState): DiagramIcon {
    const { center, radius: circleRadius } = circle
    const rotation = Math.random() * Math.PI * 2
    const sides = state.sides ? makeRegularPolygon({ radius, rotation, sides: parseInt(state.sides) }) : null
    return { ...state, center: { x: center.x, y: center.y - circleRadius - radius }, radius, sides }
  }
}

function toPoint(circle: Circle): Point {
  return circle.center
}

function getRadius(circles: VennCircles): number {
  return [...circles.first, ...circles.second, ...circles.intersection, ...circles.excluded].flat()[0].radius
}

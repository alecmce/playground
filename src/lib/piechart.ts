import { drawCircleSector } from 'src/draw/draw-segment'
import { CATEGORY, Categorized, CategoryValues, Creature } from 'src/model/creatures'
import { Fill } from 'src/model/drawing'
import { ArcPlace } from 'src/model/geometry'
import { DrawPieProps, DrawSpacesProps, PieChart } from 'src/model/piechart'
import { Size } from 'src/model/values'
import { Assignment, makeAssignments } from './assignments'
import { categorize } from './categorize'
import { quadInOut } from './ease'

interface Props {
  creatures: Creature[]
  count:     number
  radius:    number
  size:      Size
}

/**
 * Generates a ring of points around the origin such that circles with the given radius at those points touch but do not
 * intersect.
 */
export function makePieChart(props: Props): PieChart {
  const { creatures, count, radius: inputRadius, size } = props
  const { width, height } = size

  const center = { x: width / 2, y: height / 2 }
  const maxDistance = Math.min(width / 2, height / 2) - inputRadius
  const theta = 2 * Math.PI / count
  const start = -Math.PI / 2 - theta / 2
  const unScaledDistance = inputRadius / Math.sin(theta / 2)
  const distance = Math.min(maxDistance, inputRadius / Math.sin(theta / 2))
  const scale = distance / unScaledDistance

  const radius = inputRadius * scale
  const places = Array.from({ length: count }, makePlace)

  let categorized: Categorized[] | null = null
  let assignments: Assignment[] | null = null
  let categorySectors: CategorySector[] | null = null

  return { drawPie, drawSpaces, init, places, radius, reset, scale, update }

  function init(categories: CATEGORY[]): void {
    categorized = categorize({ categories, creatures })
    assignments = makeAssignments({ categorized, places, radius })
    categorySectors = makeCategorySectors(categorized, assignments)
  }

  function reset(): void {
    categorized = null
    assignments = null
    categorySectors = null
  }

  function update(proportion: number): void {
    const p = quadInOut(proportion)
    assignments?.forEach(gotoAssignment)

    function gotoAssignment(assignment: Assignment): void {
      const { creature, start, place } = assignment
      const { center } = creature

      center.x = start.x + (place.x - start.x) * p
      center.y = start.y + (place.y - start.y) * p
    }
  }

  function makePlace(_: unknown, index: number): ArcPlace {
    const angle = start + index * theta
    const x = center.x + distance * Math.cos(angle)
    const y = center.y + distance * Math.sin(angle)
    return { x, y, angle: angle - theta / 2, theta }
  }

  function drawPie(props: DrawPieProps): void {
    const { alpha, brush, context } = props
    const circle = { center, radius: distance + radius }
    categorySectors?.forEach(drawCategory)

    function drawCategory(sector: CategorySector): void {
      const { angle, theta, values } = sector
      const fill: Fill = { color: values.color ?? '#999', alpha }
      drawCircleSector({ angle, brush, circle, context, fill, theta })
    }
  }

  function drawSpaces(props: DrawSpacesProps): void {
    const { context, brush, fill } = props
    assignments?.forEach(drawPlace)

    function drawPlace(assignment: Assignment): void {
      const { place: { angle, theta } } = assignment
      const circle = { radius: distance + radius, center }
      const inner = distance - radius
      drawCircleSector({ angle, brush, circle, context, fill, theta, inner })
    }
  }

}

interface CategorySector {
  values: Partial<CategoryValues>
  angle:  number
  theta:  number
}

function makeCategorySectors(categorized: Categorized[], assignments: Assignment[]): CategorySector[] {
  return categorized.map(toCategorySector)

  function toCategorySector(categorized: Categorized): CategorySector {
    const { creatures, values } = categorized
    const [min, max] = creatures.map(findAssignment).reduce(getRange, [Infinity, -Infinity])

    return { values, angle: min, theta: max - min }

    function findAssignment(creature: Creature): Assignment {
      return assignments.find(hasCreature)!

      function hasCreature(assignment: Assignment): boolean {
        return assignment.creature === creature
      }
    }

    type Range = [min: number, max: number]

    function getRange(accumulator: Range, assignment: Assignment): Range {
      const { place: { angle, theta } } = assignment
      const [min, max] = accumulator
      return [Math.min(min, angle), Math.max(max, angle + theta)]
    }
  }
}

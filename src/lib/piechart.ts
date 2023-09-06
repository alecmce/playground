import { drawCircle } from 'src/draw/draw-circle'
import { CATEGORY, Creature } from 'src/model/creatures'
import { Point } from 'src/model/geometry'
import { PieChart, PieChartDrawProps } from 'src/model/piechart'
import { Size } from 'src/model/values'
import { PlaceAssignment, makeAssignments } from './assignments'
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

  let assignments: PlaceAssignment[] | null = null

  return { init, draw, update, places, radius, reset, scale }

  function init(categories: CATEGORY[]): void {
    const categorized = categorize({ categories, creatures })
    assignments = makeAssignments({ categorized, places, radius })
  }

  function reset(): void {
    assignments = null
  }

  function update(proportion: number): void {
    const p = quadInOut(proportion)
    assignments?.forEach(gotoAssignment)

    function gotoAssignment(assignment: PlaceAssignment): void {
      const { creature, start, place } = assignment
      const { center } = creature

      center.x = start.x + (place.x - start.x) * p
      center.y = start.y + (place.y - start.y) * p
    }
  }

  function makePlace(_: unknown, index: number): Point {
    const angle = start + index * theta
    const x = center.x + distance * Math.cos(angle)
    const y = center.y + distance * Math.sin(angle)
    return { x, y }
  }

  function draw(props: PieChartDrawProps): void {
    const { context, brush, fill } = props
    places.forEach(center => drawCircle({ context, brush, fill, circle: { radius, center } }))
  }

}

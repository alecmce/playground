import { drawCircleSector } from 'src/draw/draw-segment'
import { makeColorScale } from 'src/lib/color-scale'
import { Assignment, BackgroundDrawProps, Chart, MainDrawProps } from 'src/model/charts'
import { CATEGORY, Creature } from 'src/model/creatures'
import { Fill } from 'src/model/drawing'
import { ArcPlace } from 'src/model/geometry'
import { SeededRandom } from 'src/model/random'
import { Size } from 'src/model/values'
import { assignOptions } from '../lib/assign-options'
import { categorize } from '../lib/categorize'
import { quadInOut } from '../lib/ease'
import { makePieChartOptions } from './pie-chart-options'
import { CategorySector, makePieChartSectors } from './pie-chart-sectors'

interface Props {
  creatures: Creature[]
  count:     number
  radius:    number
  random:    SeededRandom
  size:      Size
}

/**
 * Generates a ring of points around the origin such that circles with the given radius at those points touch but do not
 * intersect.
 */
export function makePieChart(props: Props): Chart {
  const { creatures, count, radius: inputRadius, random, size } = props
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

  let assignments: Assignment<ArcPlace>[] | null = null
  let categorySectors: CategorySector[] | null = null
  let colors: string[] | null = null

  return { drawBackground, drawMain, getRadius, getScale, init, reset, setPointer, update }

  function init(categories: CATEGORY[]): void {
    const categorized = categorize({ categories, creatures })
    assignments = assignOptions(makePieChartOptions({ categorized, places, radius }))
    categorySectors = makePieChartSectors(categorized, assignments)
    colors = makeColorScale({ count: categorized.length, random })
  }

  function getRadius(): number {
    return radius
  }
  function getScale(): number {
    return scale
  }

  function reset(): void {
    colors = null
    assignments = null
    categorySectors = null
  }

  function update(proportion: number): void {
    const p = quadInOut(proportion)
    assignments?.forEach(gotoAssignment)

    function gotoAssignment(assignment: Assignment<ArcPlace>): void {
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

  function drawMain(props: MainDrawProps): void {
    const { alpha, brush, context } = props
    const circle = { center, radius: distance + radius }
    categorySectors?.forEach(drawCategory)

    function drawCategory(sector: CategorySector, i: number): void {
      const { angle, theta, values } = sector
      const fill: Fill = { color: values.color ?? colors![i], alpha }
      drawCircleSector({ angle, brush, circle, context, fill, theta })
    }
  }

  function drawBackground(props: BackgroundDrawProps): void {
    const { context, brush, fill } = props
    assignments?.forEach(drawPlace)

    function drawPlace(assignment: Assignment<ArcPlace>): void {
      const { place: { angle, theta } } = assignment
      const circle = { radius: distance + radius, center }
      const inner = distance - radius
      drawCircleSector({ angle, brush, circle, context, fill, theta, inner })
    }
  }

  function setPointer(): void {

  }
}



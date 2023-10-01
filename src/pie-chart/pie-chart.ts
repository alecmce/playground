import { useMemo } from 'react'
import { makeColorScale } from 'src/lib/color-scale'
import { Assignment, BackgroundDrawProps, CategorisationChart, MainDrawProps } from 'src/model/charts'
import { CATEGORY, CategoryValues, Creature } from 'src/model/creatures'
import { DrawingApi, Fill } from 'src/model/drawing'
import { ArcPlace, Point, Rectangle } from 'src/model/geometry'
import { POINTER_ACTION } from 'src/model/interaction'
import { makeChartState } from 'src/util/chart-state'
import { assignOptions } from '../lib/assign-options'
import { categorize } from '../lib/categorize'
import { quadInOut } from '../lib/ease'
import { makePieChartOptions } from './pie-chart-options'
import { CategorySector, makePieChartSectors } from './pie-chart-sectors'

interface Props {
  bounds:     Rectangle
  count:      number
  creatures:  Creature[]
  drawingApi: DrawingApi
  radius:     number
}

export function usePieChart(props: Partial<Props>): CategorisationChart | undefined {
  const { bounds, count, creatures, drawingApi, radius } = props

  return useMemo(() => {
    return count && creatures && drawingApi && radius && bounds
      ? makePieChart({ bounds, count, creatures, drawingApi, radius })
      : undefined
  }, [count, creatures, drawingApi, radius, bounds])
}

/**
 * Generates a ring of points around the origin such that circles with the given radius at those points touch but do not
 * intersect.
 */
export function makePieChart(props: Props): CategorisationChart {
  const { bounds, count, creatures, drawingApi, radius: inputRadius } = props
  const { drawCircleSector } = drawingApi
  const { left, right, top, bottom } = bounds
  const width = right - left
  const height = bottom - top

  const center = { x: left + width / 2, y: top + height / 2 }
  const maxDistance = Math.min(width / 2, height / 2) - inputRadius
  const theta = 2 * Math.PI / count
  const start = -Math.PI / 2 - theta / 2
  const unScaledDistance = inputRadius / Math.sin(theta / 2)
  const distance = Math.min(maxDistance, inputRadius / Math.sin(theta / 2))
  const scale = distance / unScaledDistance

  const radius = inputRadius * scale
  const places = Array.from({ length: count }, makePlace)
  const state = makeChartState({ getItem: getSectorUnderPoint })

  let assignments: Assignment<ArcPlace, CategoryValues>[] | null = null
  let categorySectors: CategorySector[] | null = null
  let colors: string[] | null = null

  return { drawBackground, drawMain, getRadius, getScale, init, reset, setPointer, update }

  function init(categories: CATEGORY[]): void {
    const categorized = categorize({ categories, creatures })
    assignments = assignOptions(makePieChartOptions({ categorized, places, radius }))
    categorySectors = makePieChartSectors({ assignments, categorized })
    colors = makeColorScale({ count: categorized.length })
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
    state.reset()
  }

  function update(proportion: number): void {
    const p = quadInOut(proportion)
    assignments?.forEach(gotoAssignment)

    function gotoAssignment(assignment: Assignment<ArcPlace, CategoryValues>): void {
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
    const { alpha: mainAlpha = 1, brush } = props
    const circle = { center, radius: distance + radius }
    categorySectors?.forEach(drawCategory)

    function drawCategory(sector: CategorySector, i: number): void {
      const { angle, theta, values } = sector
      const alpha = mainAlpha * state.getAlpha(sector)
      const fill: Fill = { color: values.color ?? colors![i], alpha }
      drawCircleSector({ angle, brush, circle, fill, theta })
    }
  }

  function drawBackground(props: BackgroundDrawProps): void {
    const { brush, fill } = props
    assignments?.forEach(drawPlace)

    function drawPlace(assignment: Assignment<ArcPlace, CategoryValues>): void {
      const { place: { angle, theta } } = assignment
      const circle = { radius: distance + radius, center }
      const inner = distance - radius
      drawCircleSector({ angle, brush, circle, fill, theta, inner })
    }
  }

  function setPointer(point: Point, action: POINTER_ACTION): void {
    state.update(point, action)
  }

  function getSectorUnderPoint(point: Point): CategorySector | null {
    const dx = point.x - center.x
    const dy = point.y - center.y
    const delta = Math.hypot(dx, dy)
    const phi = positiveAngle(Math.atan2(dy, dx))

    return delta < distance + radius
      ? categorySectors?.find(findSector) ?? null
      : null

    function findSector(sector: CategorySector): boolean {
      const { angle, theta } = sector
      const start = positiveAngle(angle)
      const end = start + theta
      return (
        (phi >= start && phi <= end) ||
        (phi + 2 * Math.PI >= start && phi + 2 * Math.PI <= end)
      )
    }
  }
}

function positiveAngle(angle: number): number {
  return angle < 0 ? angle + 2 * Math.PI : angle
}

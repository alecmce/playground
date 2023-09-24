import { drawRectangle } from 'src/draw/draw-rectangle'
import { makeColorScale } from 'src/lib/color-scale'
import { rectangleContainsPoint } from 'src/lib/rectangle-contains-point'
import { Assignment, BackgroundDrawProps, Chart, MainDrawProps } from 'src/model/charts'
import { CATEGORY, Creature } from 'src/model/creatures'
import { Fill } from 'src/model/drawing'
import { Point, Rectangle, RectanglePlace } from 'src/model/geometry'
import { SeededRandom } from 'src/model/random'
import { assignOptions } from '../lib/assign-options'
import { categorize } from '../lib/categorize'
import { quadInOut } from '../lib/ease'
import { BarChartConfig, CategorizedBarPlaces, makeCategoryBars } from './bar-chart-config'
import { makeChartState } from 'src/util/chart-state'
import { POINTER_ACTION } from 'src/model/interaction'

interface Props {
  bounds:    Rectangle
  creatures: Creature[]
  radius:    number
  random:    SeededRandom
}

/**
 * Generates a ring of points around the origin such that circles with the given radius at those points touch but do not
 * intersect.
 */
export function makeBarChart(props: Props): Chart {
  const { bounds, creatures, radius: inputRadius, random } = props

  const state = makeChartState({ getItem: getBarUnderPoint })

  let assignments: Assignment<RectanglePlace>[] | null = null
  let config: BarChartConfig | null = null
  let colors: string[] | null = null

  return { drawBackground, drawMain, getRadius, getScale, init, reset, setPointer, update }

  function init(categories: CATEGORY[]): void {
    const categorized = categorize({ categories, creatures })
    config = makeCategoryBars({ bounds, categorized, horizontal: false, proportion: 0.8 })
    assignments = assignOptions(config.options)
    colors = makeColorScale({ count: categorized.length, random })
  }

  function getRadius(): number {
    return inputRadius
  }

  function getScale(): number {
    return config ? config.radius / inputRadius : 1
  }

  function reset(): void {
    colors = null
    config = null
    assignments = null
  }

  function update(proportion: number): void {
    const p = quadInOut(proportion)
    assignments?.forEach(gotoAssignment)

    function gotoAssignment(assignment: Assignment<RectanglePlace>): void {
      const { creature, start, place } = assignment
      const { center } = creature

      center.x = start.x + (place.x - start.x) * p
      center.y = start.y + (place.y - start.y) * p
    }
  }

  function drawMain(props: MainDrawProps): void {
    const { alpha: mainAlpha = 1, brush, context } = props
    config?.categorized?.forEach(drawCategory)

    function drawCategory(bar: CategorizedBarPlaces, i: number): void {
      const { rectangle, values } = bar
      const alpha = mainAlpha * state.getAlpha(bar)
      const fill: Fill = { color: values.color ?? colors![i], alpha }
      drawRectangle({ brush, context, fill, rectangle })
    }
  }

  function drawBackground(props: BackgroundDrawProps): void {
    const { context, brush, fill } = props
    assignments?.forEach(drawPlace)

    function drawPlace(assignment: Assignment<RectanglePlace>): void {
      const { place } = assignment
      drawRectangle({ brush, context, fill, rectangle: place })
    }
  }

  function setPointer(point: Point, action: POINTER_ACTION): void {
    state.update(point, action)
  }

  function getBarUnderPoint(point: Point): CategorizedBarPlaces | null {
    return config?.categorized.find(barContainsPoint) ?? null

    function barContainsPoint(bar: CategorizedBarPlaces): boolean {
      const { rectangle } = bar
      return rectangleContainsPoint({ point, rectangle })
    }
  }
}

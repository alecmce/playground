import { drawRectangle } from 'src/draw/draw-rectangle'
import { BackgroundDrawProps, Chart, MainDrawProps } from 'src/model/charts'
import { CATEGORY, Categorized, Creature } from 'src/model/creatures'
import { Fill } from 'src/model/drawing'
import { Rectangle, RectanglePlace } from 'src/model/geometry'
import { assignOptions } from '../assign-options'
import { Assignment } from '../assignments'
import { categorize } from '../categorize'
import { quadInOut } from '../ease'
import { CategorizedBarPlaces, CategoryBars, makeCategoryBars } from './category-bars'

interface Props {
  bounds:    Rectangle
  creatures: Creature[]
  radius:    number
}

/**
 * Generates a ring of points around the origin such that circles with the given radius at those points touch but do not
 * intersect.
 */
export function makeBarChart(props: Props): Chart {
  const { bounds, creatures, radius: inputRadius } = props

  let categorized: Categorized[] | null = null
  let assignments: Assignment<RectanglePlace>[] | null = null
  let categoryBars: CategoryBars | null = null

  return { drawMain, drawBackground, init, getRadius, reset, update, getScale }

  function init(categories: CATEGORY[]): void {
    categorized = categorize({ categories, creatures })
    categoryBars = makeCategoryBars({ bounds, categorized, horizontal: false, proportion: 0.8 })
    assignments = assignOptions(categoryBars.options)
  }

  function getRadius(): number {
    return inputRadius
  }

  function getScale(): number {
    return categoryBars ? categoryBars.radius / inputRadius : 1
  }

  function reset(): void {
    categorized = null
    categoryBars = null
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
    const { alpha, brush, context } = props
    categoryBars?.categorized?.forEach(drawCategory)

    function drawCategory(sector: CategorizedBarPlaces): void {
      const { rectangle, values } = sector
      const fill: Fill = { color: values.color ?? '#999', alpha }
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
}

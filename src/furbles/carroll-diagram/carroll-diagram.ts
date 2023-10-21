import { useMemo } from 'react'
import { assignOptions } from 'src/lib/assign-options'
import { categorizeByValues } from 'src/lib/categorize-by-values'
import { quadInOut } from 'src/lib/ease'
import { rectangleContainsPoint } from 'src/lib/rectangle-contains-point'
import { Assignment, BackgroundDrawProps, MainDrawProps, SetInclusionChart } from 'src/model/charts'
import { Creature, SetInclusionState, SetInclusionValues } from 'src/model/creatures'
import { Brush, DrawingApi } from 'src/model/drawing'
import { Point, Rectangle, RectanglePlace } from 'src/model/geometry'
import { POINTER_ACTION } from 'src/model/interaction'
import { makeChartState } from 'src/util/chart-state'
import { CarrollDiagramConfig, CarrollDiagramPlaces, makeCarrollDiagramConfig } from './carroll-diagram-config'

interface Props {
  bounds:     Rectangle
  creatures:  Creature[]
  drawingApi: DrawingApi
  radius:     number
}

export function useCarrollDiagram(props: Partial<Props>): SetInclusionChart | undefined {
  const { bounds, creatures, drawingApi, radius } = props

  return useMemo(() => {
    return bounds && creatures && drawingApi && radius
      ? makeCarrollDiagram({ bounds, creatures, drawingApi, radius })
      : undefined
  }, [bounds, creatures, drawingApi, radius])
}

/**
 * Generates a ring of points around the origin such that circles with the given radius at those points touch but do not
 * intersect.
 */
export function makeCarrollDiagram(props: Props): SetInclusionChart {
  const { bounds, creatures, drawingApi, radius: inputRadius } = props
  const { drawRectangle, drawIcon } = drawingApi

  const state = makeChartState({ getItem: getCroupUnderPoint })

  let assignments: Assignment<RectanglePlace, SetInclusionValues>[] | null = null
  let config: CarrollDiagramConfig | null = null
  let pointer: Point | null = null

  return { drawBackground, drawMain, getRadius, getScale, init, reset, setPointer, update }

  function init(definition: [SetInclusionState, SetInclusionState]): void {
    const [first, second] = definition
    const categorized = categorizeByValues({ creatures, definition })
    config = makeCarrollDiagramConfig({ bounds, first, second, categorized, horizontal: false, proportion: 0.8 })
    assignments = assignOptions(config.options)
  }

  function getRadius(): number {
    return inputRadius
  }

  function getScale(): number {
    return config ? config.radius / inputRadius : 1
  }

  function reset(): void {
    config = null
    assignments = null
  }

  function update(proportion: number): void {
    const p = quadInOut(proportion)
    assignments?.forEach(gotoAssignment)

    function gotoAssignment(assignment: Assignment<RectanglePlace, SetInclusionValues>): void {
      const { creature, start, place } = assignment
      const { center } = creature

      center.x = start.x + (place.x - start.x) * p
      center.y = start.y + (place.y - start.y) * p
    }
  }

  function drawMain(props: MainDrawProps): void {
    const { alpha = 1, brush } = props
    if (config) {
      config.categorized?.forEach(drawCategory)
      drawIcon({ ...config.firstIcon, alpha, brush, pointer, eyesScale: 0.6, scale: 1 })
      drawIcon({ ...config.secondIcon, alpha, brush, pointer, eyesScale: 0.6, scale: 1 })
    }

    function drawCategory(group: CarrollDiagramPlaces): void {
      drawCategoryRectangle({ brush, group })
    }


  }

  function drawBackground(props: BackgroundDrawProps): void {
    const { brush } = props
    config?.categorized?.forEach(drawCategory)

    function drawCategory(group: CarrollDiagramPlaces): void {
      drawCategoryRectangle({ brush, group })
    }
  }

  interface DrawCategoryProps {
    brush:     Brush | undefined
    group:     CarrollDiagramPlaces
  }

  function drawCategoryRectangle(props: DrawCategoryProps): void {
    const { brush, group } = props
    const { rectangle } = group
    drawRectangle({ brush, rectangle })
  }

  function setPointer(point: Point, action: POINTER_ACTION): void {
    pointer = point
    state.update(point, action)
  }

  function getCroupUnderPoint(point: Point): CarrollDiagramPlaces | null {
    return config?.categorized.find(groupContainsPoint) ?? null

    function groupContainsPoint(group: CarrollDiagramPlaces): boolean {
      const { rectangle } = group
      return rectangleContainsPoint({ point, rectangle })
    }
  }
}

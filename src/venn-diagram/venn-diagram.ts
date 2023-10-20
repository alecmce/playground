import { useMemo } from 'react'
import { categorizeByValues } from 'src/lib/categorize-by-values'
import { Assignment, BackgroundDrawProps, MainDrawProps, SetInclusionChart } from 'src/model/charts'
import { Creature, SetInclusionState, SetInclusionValues } from 'src/model/creatures'
import { DrawingApi } from 'src/model/drawing'
import { Point, Rectangle } from 'src/model/geometry'
import { POINTER_ACTION } from 'src/model/interaction'
import { makeChartState } from 'src/util/chart-state'
import { assignOptions } from '../lib/assign-options'
import { quadInOut } from '../lib/ease'
import { VennDiagramConfig, VennDiagramPlaces, makeVennDiagramConfig } from './venn-diagram-config'

interface Props {
  bounds:     Rectangle
  creatures:  Creature[]
  drawingApi: DrawingApi
  radius:     number
}

export function useVennDiagram(props: Partial<Props>): SetInclusionChart | undefined {
  const { bounds, creatures, drawingApi, radius } = props

  return useMemo(() => {
    return bounds && creatures && drawingApi && radius
      ? makeVennDiagram({ bounds, creatures, drawingApi, radius })
      : undefined
  }, [bounds, creatures, drawingApi, radius])
}

/**
 * Generates a ring of points around the origin such that circles with the given radius at those points touch but do not
 * intersect.
 */
export function makeVennDiagram(props: Props): SetInclusionChart {
  const { bounds, creatures, drawingApi, radius: inputRadius } = props
  const { drawCircle, drawIcon } = drawingApi

  const state = makeChartState({ getItem: getCroupUnderPoint })

  let assignments: Assignment<Point, SetInclusionValues>[] | null = null
  let config: VennDiagramConfig | null = null
  let pointer: Point | null = null

  return { drawBackground, drawMain, getRadius, getScale, init, reset, setPointer, update }

  function init(definition: [SetInclusionState, SetInclusionState]): void {
    const [first, second] = definition
    const categorized = categorizeByValues({ creatures, definition })
    config = makeVennDiagramConfig({ bounds, first, second, categorized, horizontal: false, proportion: 0.8 })
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

    function gotoAssignment(assignment: Assignment<Point, SetInclusionValues>): void {
      const { creature, start, place } = assignment
      const { center } = creature

      center.x = start.x + (place.x - start.x) * p
      center.y = start.y + (place.y - start.y) * p
    }
  }

  function drawMain(props: MainDrawProps): void {
    const { alpha = 1, brush } = props
    if (config) {
      drawCircle({ brush, circle: config.firstCircle })
      drawCircle({ brush, circle: config.secondCircle })
      drawIcon({ ...config.firstIcon, alpha, brush, pointer, eyesScale: 0.6, scale: 1 })
      drawIcon({ ...config.secondIcon, alpha, brush, pointer, eyesScale: 0.6, scale: 1 })
    }
  }

  function drawBackground(props: BackgroundDrawProps): void {
    const { brush } = props
    if (config) {
      drawCircle({ brush, circle: config.firstCircle })
      drawCircle({ brush, circle: config.secondCircle })
    }
  }

  function setPointer(point: Point, action: POINTER_ACTION): void {
    pointer = point
    state.update(point, action)
  }

  function getCroupUnderPoint(): VennDiagramPlaces | null {
    return null
    // return config?.categorized.find(groupContainsPoint) ?? null

    // function groupContainsPoint(group: VennDiagramPlaces): boolean {
    //   const { rectangle } = group
    //   return rectangleContainsPoint({ point, rectangle })
    // }
  }
}

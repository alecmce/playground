import { useMemo } from 'react'
import { Creature, CreatureDrawProps, MakeCreatures } from 'src/model/creatures'
import { Brush, DrawingApi } from 'src/model/drawing'
import { Point, Rectangle } from 'src/model/geometry'
import { PopulationModel } from 'src/model/population'
import { makeBaseBrush } from './base-brush'
import { lighten } from './color-utils'
import { getDistance } from './math-utils'
import { makePositionFactory } from './positions'
import { makeRegularPolygon } from './regular-polygon'
import { makeSeededRandom } from './seeded-random'

const UNIT_SCALAR = 60

interface Props {
  bounds:     Rectangle
  drawingApi: DrawingApi
  brush:      Brush
  maxCount:   number
  radius:     number
}

export function useCreatureFactory(props: Partial<Props>): MakeCreatures | undefined {
  const { bounds, brush, drawingApi, maxCount, radius } = props

  return useMemo(() => {
    return bounds && brush && drawingApi && maxCount && radius
      ? makeCreatureFactory({ bounds, brush, drawingApi, maxCount, radius })
      : undefined
  }, [bounds, brush, drawingApi, maxCount, radius])
}

let NEXT_CREATURE_ID = 0

export function makeCreatureFactory(props: Props): MakeCreatures {
  const { bounds, brush: baseBrush, drawingApi, maxCount, radius } = props
  const { drawPolygon, drawEyes } = drawingApi

  const makePositions = makePositionFactory()

  return  function makeCreatures(model: PopulationModel): Creature[] {
    const { colors: colorsList, count, eyes: eyesList, seed, sides: sidesList } = model
    const random = makeSeededRandom(seed)

    const baseScalar = Math.min(1, radius / UNIT_SCALAR)
    const mainBrush = makeBaseBrush({ brush: baseBrush, radius })

    return makePositions({ bounds, count, maxCount, radius, seed }).map(makeCreature)

    function makeCreature(center: Point): Creature {
      const id = `creature-${NEXT_CREATURE_ID++}`
      const sides = random.from(sidesList)
      const color = random.from(colorsList)
      const eyes = random.from(eyesList)
      const rotation = random.float(0, 2 * Math.PI)
      const polygon = makeRegularPolygon({ center: { x: 0, y: 0 }, radius, rotation, sides: parseInt(sides, 10) })
      const baseFill = { color }

      const self = { id, center, color, draw, eyes, radius, isUnder, sides }
      return self

      function draw(props: CreatureDrawProps): void {
        const { alpha = 1, pointer: givenPointer, scale, target } = props
        const isTarget = target === self

        const fill = isTarget
          ? { alpha, color: lighten(color) }
          : { ...baseFill, alpha }

        const brush = alpha === 1
          ? mainBrush
          : { ...mainBrush, alpha }

        const pointer = isTarget ? null : givenPointer

        drawPolygon({ brush, fill, center, polygon, scale })
        drawEyes({ alpha, brush, center, eyes, pointer, scale: scale * baseScalar })
      }

      function isUnder(pointer: Point): boolean {
        return getDistance(center, pointer) < radius
      }
    }
  }
}

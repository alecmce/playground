import { useMemo } from 'react'
import { Creature, CreatureDrawProps, MakeCreatures, MakeCreaturesProps } from 'src/model/creatures'
import { DrawingApi } from 'src/model/drawing'
import { Point } from 'src/model/geometry'
import { makeBaseBrush } from './base-brush'
import { lighten } from './color-utils'
import { getDistance } from './math-utils'
import { makePositionFactory } from './positions'
import { makeRegularPolygon } from './regular-polygon'
import { makeSeededRandom } from './seeded-random'

const UNIT_SCALAR = 60

interface Props {
  drawingApi: DrawingApi
  maxCount:   number
}

export function useCreatureFactory(props: Partial<Props>): MakeCreatures | undefined {
  const { drawingApi, maxCount } = props

  return useMemo(() => {
    return drawingApi && maxCount ? makeCreatureFactory({ drawingApi, maxCount }) : undefined
  }, [drawingApi, maxCount])
}

export function makeCreatureFactory(props: Props): MakeCreatures {
  const { drawingApi, maxCount } = props
  const { drawPolygon, drawEyes } = drawingApi

  const makePositions = makePositionFactory()

  return  function makeCreatures(props: MakeCreaturesProps): Creature[] {
    const { bounds, brush: baseBrush, population, radius } = props
    const { colors: colorsList, count, eyes: eyesList, seed, sides: sidesList } = population
    const random = makeSeededRandom(seed)

    const baseScalar = Math.min(1, radius / UNIT_SCALAR)
    const brush = makeBaseBrush({ brush: baseBrush, radius })

    return makePositions({ bounds, count, maxCount, radius, seed }).map(makeCreature)

    function makeCreature(center: Point): Creature {
      const sides = random.from(sidesList)
      const color = random.from(colorsList)
      const eyes = random.from(eyesList)
      const rotation = random.float(0, 2 * Math.PI)
      const polygon = makeRegularPolygon({ center: { x: 0, y: 0 }, radius, rotation, sides: parseInt(sides, 10) })
      const baseFill = { color }

      const self = { center, color, draw, eyes, radius, isUnder, sides }
      return self

      function draw(props: CreatureDrawProps): void {
        const { pointer: givenPointer, scale, target } = props
        const isTarget = target === self

        const fill = isTarget
          ? { color: lighten(color) }
          : baseFill

        const pointer = isTarget ? null : givenPointer

        drawPolygon({ brush, fill, center, polygon, scale })
        drawEyes({ brush, center, eyes, pointer, scale: scale * baseScalar })
      }

      function isUnder(pointer: Point): boolean {
        return getDistance(center, pointer) < radius
      }
    }
  }
}

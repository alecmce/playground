import { mix } from 'chroma-js'
import { drawEyes } from 'src/draw/draw-eye'
import { drawPolygon } from 'src/draw/draw-polygon'
import { Creature, CreatureDrawProps } from 'src/model/creatures'
import { Brush } from 'src/model/drawing'
import { Point } from 'src/model/geometry'
import { PopulationModel } from 'src/model/population'
import { Size } from 'src/model/values'
import { getDistance } from './math-utils'
import { makePositionFactory } from './positions'
import { makeRegularPolygon } from './regular-polygon'
import { makeSeededRandom } from './seeded-random'

interface Props {
  brush:      Brush
  population: PopulationModel
  radius:     number
  size:       Size
}

const UNIT_SCALAR = 60

export interface MakeCreatures {
  (props: Props): Creature[]
}

export function makeCreatureFactory(maxCount: number): MakeCreatures {
  const makePositions = makePositionFactory()

  return  function makeCreatures(props: Props): Creature[] {
    const { brush: baseBrush, population, radius, size } = props
    const { colors: colorsList, count, eyes: eyesList, seed, sides: sidesList } = population
    const random = makeSeededRandom(seed)

    const baseScalar = Math.min(1, radius / UNIT_SCALAR)
    const brush = baseScalar < 1
      ? { ...baseBrush, width: baseBrush.width * baseScalar }
      : baseBrush

    return makePositions({ count, maxCount, radius, seed, size }).map(makeCreature)

    function makeCreature(center: Point): Creature {
      const sides = random.from(sidesList)
      const color = random.from(colorsList)
      const eyes = random.from(eyesList) as 1 | 2 | 3 | 4 | 5
      const rotation = random.float(0, 2 * Math.PI)
      const polygon = makeRegularPolygon({ center: { x: 0, y: 0 }, radius, rotation, sides })
      const baseFill = { color }

      const self = { center, color, draw, eyes, isUnder, sides }
      return self

      function draw(props: CreatureDrawProps): void {
        const { context, pointer, scale, target } = props

        const fill = target === self
          ? { color: mix(color, 'white', 0.3).hex() }
          : baseFill

        drawPolygon({ brush, context, fill, center, polygon, scale })
        drawEyes({ brush, center, context, eyes, pointer, scale: scale * baseScalar })
      }

      function isUnder(pointer: Point): boolean {
        return getDistance(center, pointer) < radius
      }
    }
  }
}

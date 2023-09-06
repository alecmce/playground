import { mix } from 'chroma-js'
import { drawEyes } from 'src/draw/draw-eye'
import { drawPolygon } from 'src/draw/draw-polygon'
import { Creature, CreatureDrawProps } from 'src/model/creatures'
import { Brush } from 'src/model/drawing'
import { Point } from 'src/model/geometry'
import { SeededRandom } from 'src/model/random'
import { Size } from 'src/model/values'
import { getDistance } from './math-utils'
import { makeRegularPolygon } from './polygon'
import { makePositions } from './positions'

interface Props {
  brush:  Brush
  colors: string[]
  count:  number
  eyes:   Array<1 | 2 | 3 | 4 | 5>
  radius: number
  random: SeededRandom
  sides:  number[]
  size:   Size
}

const UNIT_SCALAR = 60

export function makeCreatures(props: Props): Creature[] {
  const { brush: baseBrush, colors: colorsList, count, eyes: eyesList, radius, random, sides: sidesList, size } = props

  const baseScalar = Math.min(1, radius / UNIT_SCALAR)
  const brush = baseScalar < 1
    ? { ...baseBrush, width: baseBrush.width * baseScalar }
    : baseBrush

  const positions = makePositions({ count, radius, size })
  return positions.map(makeCreature)

  function makeCreature(center: Point): Creature {
    const sides = random.from(sidesList)
    const color = random.from(colorsList)
    const eyes = random.from(eyesList)
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

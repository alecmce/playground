import { splitArray } from 'src/lib/array-util'
import { getRandomSeed, makeSeededRandom } from 'src/lib/seeded-random'
import { CATEGORY, Creature, MakeCreatures } from 'src/model/creatures'
import { DrawFurblesProps, DrawingApi } from 'src/model/drawing'
import { Rectangle } from 'src/model/geometry'
import { InTheRingPuzzle } from 'src/model/puzzle'
import { prune } from 'src/util/object-util'
import { COLORS as COLOR_VALUES, EYES as EYES_VALUES, SIDES as SIDES_VALUES } from '../constants'
import { makeInTheRingConfig } from './in-the-ring-config'

interface Props {
  bounds:        Rectangle
  complexity:    1 | 2 | 3
  drawingApi:    DrawingApi
  makeCreatures: MakeCreatures
  seed?:         number
}

const { COLOR, EYES, SIDES } = CATEGORY

export function makeInTheRingPuzzle(props: Props): InTheRingPuzzle {
  const { bounds, complexity, drawingApi, makeCreatures, seed = getRandomSeed()} = props

  const name = `In The Ring • Level ${complexity}`
  const random = makeSeededRandom(seed)

  const primary = random.from([COLOR, COLOR, COLOR, SIDES, SIDES, EYES])
  const secondary = random.from([COLOR, SIDES, EYES].filter(c => c !== primary))

  const colors = getValues(COLOR_VALUES.map(c => c.value), COLOR)
  const eyes = getValues(EYES_VALUES.map(e => e.value), EYES)
  const sides = getValues(SIDES_VALUES.map(s => s.value), SIDES)
  const count = getCount()

  const creatures = makeCreatures({ colors, count, eyes, seed, sides })

  const inGroup = prune({
    [COLOR]: isUsed(COLOR) ? colors[0] : undefined,
    [EYES]:  isUsed(EYES)  ? eyes[0]   : undefined,
    [SIDES]: isUsed(SIDES) ? sides[0]  : undefined,
  })

  const outGroup = prune({
    [COLOR]: isUsed(COLOR) ? colors.slice(1) : undefined,
    [EYES]:  isUsed(EYES)  ? eyes.slice(1)   : undefined,
    [SIDES]: isUsed(SIDES) ? sides.slice(1)  : undefined,
  })

  const [inGroupCreatures, outGroupCreatures] = splitArray(creatures, isInGroup)

  const puzzle: InTheRingPuzzle = { creatures, drawEnter, drawMain, drawExit, inGroup, inGroupCreatures, name, outGroup, outGroupCreatures, seed }
  const config = makeInTheRingConfig({ bounds, puzzle })
  return puzzle

  function getValues(values: string[], target: CATEGORY): string[] {
    return random.list(values, getColorCount())

    function getColorCount(): number {
      switch (complexity) {
        case 1: return isUsed(target) ? 3 : 1
        case 2: return isUsed(target) ? 3 : 2
        case 3: return 3
      }
    }
  }

  function isUsed(category: CATEGORY): boolean {
    return category === primary || (category === secondary && complexity > 1)
  }

  function getCount(): number {
    switch (complexity) {
      case 1: return 6
      case 2: return 12
      case 3: return 18
    }
  }

  function isInGroup(creature: Creature): boolean {
    const { color, eyes, sides } = creature
    const { [COLOR]: groupColor, [EYES]: groupEyes, [SIDES]: groupSides } = inGroup

    return (
      (!groupColor || color === groupColor) &&
      (!groupEyes || eyes === groupEyes) &&
      (!groupSides || sides === groupSides)
    )
  }

  function drawEnter(props: DrawFurblesProps, proportion: number): void {
    const { brush, pointer } = props
    const { drawCircle } = drawingApi

    const alpha = proportion
    drawCircle({ brush: { ...brush, alpha }, circle: config.circle })
    creatures.forEach(creature => creature.draw({ alpha, pointer, scale: 1, target: null }))
  }

  function drawMain(props: DrawFurblesProps): void {
    const { brush, pointer } = props
    const { drawCircle } = drawingApi

    drawCircle({ brush, circle: config.circle })
    creatures.forEach(creature => creature.draw({ pointer, scale: 1, target: null }))
  }

  function drawExit(props: DrawFurblesProps, proportion: number): void {
    const { brush, pointer } = props
    const { drawCircle } = drawingApi

    const alpha = 1 - proportion
    drawCircle({ brush: { ...brush, alpha }, circle: config.circle })
    creatures.forEach(creature => creature.draw({ alpha, pointer, scale: 1, target: null }))
  }
}

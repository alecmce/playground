import { splitArray } from 'src/lib/array-util'
import { getRandomSeed, makeSeededRandom } from 'src/lib/seeded-random'
import { CATEGORY, Creature, MakeCreatures } from 'src/model/creatures'
import { SetInclusionPuzzle } from 'src/model/puzzle'
import { prune } from 'src/util/object-util'
import { COLOR_VALUES, EYES_VALUES, SIDES_VALUES } from '../constants'

interface Props {
  complexity:    1 | 2 | 3
  seed?:         number
  makeCreatures: MakeCreatures
}

const { COLOR, EYES, SIDES } = CATEGORY

export function makeSetInclusionPuzzle(props: Props): SetInclusionPuzzle {
  const { complexity, makeCreatures, seed = getRandomSeed()} = props

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

  return { creatures, inGroup, outGroup, inGroupCreatures, outGroupCreatures }

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
}

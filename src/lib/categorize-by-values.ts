import { CATEGORY, CATEGORY_TYPE, Categorized, Creature, SetInclusionState, SetInclusionValues } from 'src/model/creatures'
import { isDefined, prune } from 'src/util/object-util'


interface Props {
  creatures:  Creature[]
  definition: [SetInclusionState, SetInclusionState]
}

/** Categorises creatures based on the given two category values. */
export function categorizeByValues(props: Props): Categorized<SetInclusionValues>[] {
  const { creatures, definition } = props
  const [first, second] = definition

  const firstCreatures: Creature[] = []
  const secondCreatures: Creature[] = []
  const unionCreatures: Creature[] = []
  const excludedCreatures: Creature[] = []

  creatures.forEach(categorizeCreature)

  return [
    { creatures: unionCreatures, values: makeUnionCategoryValues(first, second), type: CATEGORY_TYPE.INTERSECTION },
    { creatures: firstCreatures, values: makeCategoryValues(first), type: CATEGORY_TYPE.FIRST },
    { creatures: secondCreatures, values: makeCategoryValues(second), type: CATEGORY_TYPE.SECOND },
    { creatures: excludedCreatures, values: {}, type: CATEGORY_TYPE.EXCLUDED },
  ]

  function categorizeCreature(creature: Creature): void {
    const matchesFirst = matchesCategorized(creature, first)
    const matchesSecond = matchesCategorized(creature, second)

    if (matchesFirst && matchesSecond) {
      unionCreatures.push(creature)
    } else if (matchesFirst) {
      firstCreatures.push(creature)
    } else if (matchesSecond) {
      secondCreatures.push(creature)
    } else {
      excludedCreatures.push(creature)
    }
  }

  function matchesCategorized(creature: Creature, definition: SetInclusionState): boolean {
    return !!(
      (!definition.color || definition.color === creature.color)  &&
      (!definition.eyes  || definition.eyes === creature.eyes)   &&
      (!definition.sides || definition.sides === creature.sides)
    )
  }
}

function makeCategoryValues(state: SetInclusionState): SetInclusionValues {
  return prune<SetInclusionValues>({
    [CATEGORY.COLOR]: [state[CATEGORY.COLOR]].filter(isDefined),
    [CATEGORY.EYES]:  [state[CATEGORY.EYES]].filter(isDefined),
    [CATEGORY.SIDES]: [state[CATEGORY.SIDES]].filter(isDefined),
  })
}

function makeUnionCategoryValues(first: SetInclusionState, second: SetInclusionState): SetInclusionValues {
  return prune<SetInclusionValues>({
    [CATEGORY.COLOR]: union(first[CATEGORY.COLOR], second[CATEGORY.COLOR]),
    [CATEGORY.EYES]:  union(first[CATEGORY.EYES], second[CATEGORY.EYES]),
    [CATEGORY.SIDES]: union(first[CATEGORY.SIDES], second[CATEGORY.SIDES]),
  })
}

function union(a: string | undefined, b: string | undefined): string[] | undefined {
  if (a && b) {
    return a === b ? [a] : [a, b]
  } else {
    return undefined
  }
}

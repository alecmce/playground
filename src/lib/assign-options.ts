import { Assignment } from 'src/model/charts'
import { Point } from 'src/model/geometry'

/**
 * Chooses which assignments are actually used from a set of all  possible assignemnts, by finding the
 * creature with the longest possible assignment, and assigning to it the shortest avaialable place,
 * and repreating.
 */
export function assignOptions<T extends Point>(options: Assignment<T>[]): Assignment<T>[] {
  const consumed = new Set<Assignment<T>>()
  const assignments: Assignment<T>[] = []
  options.forEach(assignOrSkip)
  return assignments

  function assignOrSkip(option: Assignment<T>): void {
    const { creature } = option
    if (!consumed.has(option)) {
      const creatureOptions = filterOptions(o => o.creature === creature)
      const assigned = creatureOptions.at(-1)!
      assignments.push(assigned)
      const placeOptions = filterOptions(o => o.place === assigned.place)
      consumeOptions(creatureOptions)
      consumeOptions(placeOptions)
    }

    function filterOptions(fn: (option: Assignment<T>) => boolean): Assignment<T>[] {
      return options.filter(o => !consumed.has(o) && fn(o))
    }

    function consumeOptions(options: Assignment<T>[]): void {
      options.forEach(o => consumed.add(o))
    }
  }
}

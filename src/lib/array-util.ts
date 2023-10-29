import { max } from './math-utils'

export function zip<T extends unknown[]>(...lists: { [k in keyof T]: (T[k])[] }): T[] {
  const tupleLength = max(lists.map(list => list.length))
  return Array.from({ length: tupleLength }, (_, i) => lists.map(list => list[i])) as T[]
}

export function makePairs<T>(items: T[]): [T, T][] {
  const pairs: [T, T][] = []
  for (let i = 0; i < items.length; i++) {
    const a = items[i]
    for (let j = i + 1; j < items.length; j++) {
      const b = items[j]
      pairs.push([a, b])
    }
  }
  return pairs
}

export function removeDuplicates<T>(items: T[]): T[] {
  return Array.from(new Set(items))
}

interface Filter<T> {
  (item: T, index: number, list: T[]): boolean
}

/** Splits an array into two arrays based on a filter function. */
export function splitArray<T>(array: T[], inGroupFilter: Filter<T>): [T[], T[]] {
  const inGroup: T[] = []
  const outGroup: T[] = []

  array.forEach((item, i, array) => {
    const group = inGroupFilter(item, i, array) ? inGroup : outGroup
    group.push(item)
  })
  return [inGroup, outGroup]
}

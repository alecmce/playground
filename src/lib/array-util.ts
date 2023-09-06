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

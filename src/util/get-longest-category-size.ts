import { Categorized } from 'src/model/creatures'

export function getLongestCategorySize<C>(categorized: Categorized<C>[]): number {
  return Math.max(...categorized.map(getCategoryLength))

  function getCategoryLength(category: Categorized<C>): number {
    const { creatures } = category
    return creatures.length
  }
}

import { CATEGORY, Categorized, CategoryValues, Creature } from 'src/model/creatures'


interface Props {
  categories: CATEGORY[]
  creatures:  Creature[]
}

export function categorize(props: Props): Categorized[] {
  const { categories, creatures } = props

  const categoryMap = new Map<string, Categorized>()
  creatures.forEach(categorizeCreature)
  return Array.from(categoryMap.values())

  function categorizeCreature(creature: Creature): void {
    const { color, eyes, sides } = creature
    const values = getCategories()

    const key = Object.values(values).join('|')
    categoryMap.has(key)
      ? categoryMap.get(key)!.creatures.push(creature)
      : categoryMap.set(key, { creatures: [creature], values })

    function getCategories(): Partial<CategoryValues> {
      return Object.fromEntries(categories.map(category => [category, getValue(category)]))
    }

    function getValue(category: CATEGORY): string | number {
      switch (category) {
        case CATEGORY.COLOR: return color
        case CATEGORY.EYES:  return eyes
        case CATEGORY.SIDES: return sides
      }
    }
  }
}

import { Assignment } from 'src/model/charts'
import { Categorized, CategoryValues, Creature } from 'src/model/creatures'
import { ArcPlace } from 'src/model/geometry'


export interface CategorySector {
  values: Partial<CategoryValues>
  angle:  number
  theta:  number
}

interface Props {
  assignments: Assignment<ArcPlace, CategoryValues>[]
  categorized: Categorized<CategoryValues>[]
}

export function makePieChartSectors(props: Props): CategorySector[] {
  const { assignments, categorized } = props
  return categorized.map(toCategorySector)

  function toCategorySector(categorized: Categorized<CategoryValues>): CategorySector {
    const { creatures, values } = categorized
    const [min, max] = creatures.map(findAssignment).reduce(getRange, [Infinity, -Infinity])

    return { values, angle: min, theta: max - min }

    function findAssignment(creature: Creature): Assignment<ArcPlace, CategoryValues> {
      return assignments.find(hasCreature)!

      function hasCreature(assignment: Assignment<ArcPlace, CategoryValues>): boolean {
        return assignment.creature === creature
      }
    }

    type Range = [min: number, max: number];

    function getRange(accumulator: Range, assignment: Assignment<ArcPlace, CategoryValues>): Range {
      const { place: { angle, theta } } = assignment
      const [min, max] = accumulator
      return [Math.min(min, angle), Math.max(max, angle + theta)]
    }
  }
}

import { Assignment } from 'src/model/charts'
import { Categorized, CategoryValues, Creature } from 'src/model/creatures'
import { ArcPlace } from 'src/model/geometry'


export interface CategorySector {
  values: Partial<CategoryValues>
  angle:  number
  theta:  number
}

export function makePieChartSectors(categorized: Categorized[], assignments: Assignment<ArcPlace>[]): CategorySector[] {
  return categorized.map(toCategorySector)

  function toCategorySector(categorized: Categorized): CategorySector {
    const { creatures, values } = categorized
    const [min, max] = creatures.map(findAssignment).reduce(getRange, [Infinity, -Infinity])

    return { values, angle: min, theta: max - min }

    function findAssignment(creature: Creature): Assignment<ArcPlace> {
      return assignments.find(hasCreature)!

      function hasCreature(assignment: Assignment<ArcPlace>): boolean {
        return assignment.creature === creature
      }
    }

    type Range = [min: number, max: number];

    function getRange(accumulator: Range, assignment: Assignment<ArcPlace>): Range {
      const { place: { angle, theta } } = assignment
      const [min, max] = accumulator
      return [Math.min(min, angle), Math.max(max, angle + theta)]
    }
  }
}

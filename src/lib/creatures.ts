import { useMemo } from 'react'
import { Creature, MakeCreatures } from 'src/model/creatures'
import { PopulationModel } from 'src/model/population'
import { PuzzleModel } from 'src/model/puzzle'

interface Props {
  makeCreatures: MakeCreatures | undefined
  population:    PopulationModel
  puzzle:        PuzzleModel | null
}

export function useCreatures(props: Partial<Props> = {}): Creature[] | undefined {
  const { makeCreatures, population, puzzle } = props

  return useMemo(() => {
    if (puzzle) {
      return puzzle.creatures
    } else {
      return makeCreatures && population
        ? makeCreatures(population)
        : undefined
    }
  }, [makeCreatures, population])
}

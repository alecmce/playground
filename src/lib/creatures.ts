import { useEffect, useMemo, useState } from 'react'
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

  const [creatures, setCreatures] = useState<Creature[] | undefined>(undefined)

  useEffect(() => {
    const creatures = makeCreatures && population
      ? makeCreatures(population)
      : undefined
    setCreatures(creatures)
  }, [makeCreatures, population])

  return useMemo(() => {
    return puzzle
      ? puzzle.creatures
      : creatures
  }, [creatures, puzzle])
}

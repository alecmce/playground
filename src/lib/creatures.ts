import { useMemo } from 'react'
import { Creature, MakeCreatures } from 'src/model/creatures'
import { PopulationModel } from 'src/model/population'

interface Props {
  makeCreatures: MakeCreatures | undefined
  population:    PopulationModel
}

export function useCreatures(props: Partial<Props> = {}): Creature[] | undefined {
  const { makeCreatures, population } = props

  return useMemo(() => {
    return makeCreatures && population
      ? makeCreatures(population)
      : undefined
  }, [makeCreatures, population])
}

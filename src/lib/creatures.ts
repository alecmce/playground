import { useMemo } from 'react'
import { Creature, MakeCreatures } from 'src/model/creatures'
import { Brush } from 'src/model/drawing'
import { Rectangle } from 'src/model/geometry'
import { PopulationModel } from 'src/model/population'

interface Props {
  brush:         Brush
  makeCreatures: MakeCreatures | undefined
  population:    PopulationModel
  radius:        number
  bounds:        Rectangle
}

export function useCreatures(props: Partial<Props>): Creature[] | undefined {
  const { brush, makeCreatures, population, radius, bounds } = props

  return useMemo(() => {
    return brush && makeCreatures && population && radius && bounds
      ? makeCreatures({ brush, population, radius, bounds })
      : undefined
  }, [makeCreatures, population, radius, bounds])
}

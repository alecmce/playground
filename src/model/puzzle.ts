import { Creature, SetInclusionState, SetInclusionValues } from './creatures'

export interface SetInclusionPuzzle {
  creatures:          Creature[]
  inGroup:            SetInclusionState
  outGroup:           SetInclusionValues
  inGroupCreatures:   Creature[]
  outGroupCreatures:  Creature[]
}

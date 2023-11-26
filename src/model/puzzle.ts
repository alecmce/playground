import { Creature, SetInclusionState, SetInclusionValues } from './creatures'
import { DrawFurblesProps } from './drawing'

export interface PuzzleModel {
  creatures: Creature[]
  name:      string
  seed:      number
  drawEnter: (props: DrawFurblesProps, p: number) => void
  drawMain:  (props: DrawFurblesProps) => void
  drawExit:  (props: DrawFurblesProps, p: number) => void
}

export interface InTheRingPuzzle extends PuzzleModel {
  inGroup:           SetInclusionState
  outGroup:          SetInclusionValues
  joinGroup:         SetInclusionValues
  inGroupCreatures:  Creature[]
  outGroupCreatures: Creature[]
}

import { useMemo } from 'react'
import { PUZZLE_TYPE, PuzzleSetupModel } from 'src/model/app-state'
import { MakeCreatures } from 'src/model/creatures'
import { DrawingApi } from 'src/model/drawing'
import { Rectangle } from 'src/model/geometry'
import { Puzzle } from 'src/model/puzzle'
import { makeInTheRingPuzzle } from '../in-the-ring/in-the-ring-puzzle'

interface Props {
  bounds:        Rectangle
  drawingApi:    DrawingApi | undefined
  makeCreatures: MakeCreatures | undefined
  puzzle:        PuzzleSetupModel | undefined
}

// TODO: Make bounds mutate current puzzle
export function useCurrentPuzzle(props: Props): Puzzle | null {
  const { bounds, drawingApi, makeCreatures, puzzle } = props

  return useMemo(() => {
    return drawingApi && makeCreatures && puzzle
      ? makePuzzle({ bounds, drawingApi, makeCreatures, puzzle })
      : null
  }, [bounds, drawingApi, makeCreatures, puzzle])
}

interface DefinedProps {
  bounds:        Rectangle
  drawingApi:    DrawingApi
  makeCreatures: MakeCreatures
  puzzle:        PuzzleSetupModel
}

function makePuzzle(props: DefinedProps): Puzzle | null {
  const { bounds, drawingApi, makeCreatures, puzzle } = props
  const { complexity, seed, type } = puzzle

  switch (type) {
    case PUZZLE_TYPE.IN_THE_RING: return makeInTheRingPuzzle({ bounds, complexity, drawingApi, makeCreatures, seed })
    default:                      return null
  }
}

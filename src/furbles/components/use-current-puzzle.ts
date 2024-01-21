import { useMemo } from 'react'
import { AppStateAction, PUZZLE_TYPE, PuzzleSetupModel } from 'src/model/app-state'
import { MakeCreatures } from 'src/model/creatures'
import { DrawingApi } from 'src/model/drawing'
import { Rectangle } from 'src/model/geometry'
import { Puzzle } from 'src/model/puzzle'
import { makeInTheRingPuzzle } from '../in-the-ring/in-the-ring-puzzle'

interface Props {
  bounds:           Rectangle
  dispatchAppState: (action: AppStateAction) => void
  drawingApi:       DrawingApi | undefined
  makeCreatures:    MakeCreatures | undefined
  puzzle:           PuzzleSetupModel | undefined
}

// TODO: Make bounds mutate current puzzle
export function useCurrentPuzzle(props: Props): Puzzle | null {
  const { bounds, dispatchAppState, drawingApi, makeCreatures, puzzle } = props

  return useMemo(() => {
    return drawingApi && makeCreatures && puzzle
      ? makePuzzle({ bounds, dispatchAppState, drawingApi, makeCreatures, puzzle })
      : null
  }, [bounds, dispatchAppState, drawingApi, makeCreatures, puzzle])
}

interface DefinedProps {
  dispatchAppState: (action: AppStateAction) => void
  bounds:           Rectangle
  drawingApi:       DrawingApi
  makeCreatures:    MakeCreatures
  puzzle:           PuzzleSetupModel
}

function makePuzzle(props: DefinedProps): Puzzle | null {
  const { bounds, dispatchAppState, drawingApi, makeCreatures, puzzle } = props
  const { complexity, seed, type } = puzzle

  switch (type) {
    case PUZZLE_TYPE.IN_THE_RING: return inTheRing()
    default:                      return null
  }

  function inTheRing(): Puzzle {
    return makeInTheRingPuzzle({ bounds, complexity, dispatchAppState, drawingApi, makeCreatures, seed })
  }
}

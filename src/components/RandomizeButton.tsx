import CasinoIcon from '@mui/icons-material/Casino'
import Box from '@mui/joy/Box'
import Button from '@mui/material/Button'
import { produce } from 'immer'
import { Dispatch, ReactElement, SetStateAction } from 'react'
import { getRandomSeed } from 'src/lib/seeded-random'
import { PopulationModel } from 'src/model/population'

interface Props {
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
}

export function RandomizeButton(props: Props): ReactElement {
  const { setPopulation } = props

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
      <Button
        aria-label="randomize"
        variant="contained"
        startIcon={<CasinoIcon />}
        onClick={randomize}
      >
        Randomize
      </Button>
    </Box>
  )

  function randomize(): void {
    setPopulation(model => produce(model, draft => {
      draft.seed = getRandomSeed()
    }))
  }
}

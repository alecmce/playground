import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { produce } from 'immer'
import { Dispatch, MouseEvent, ReactElement, SetStateAction } from 'react'
import { DEFAULT_EYES, EYES } from 'src/constants'
import { PopulationModel } from 'src/model/population'

interface Props {
  population:    PopulationModel
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
}

const ID = 'population-eyes'

export function EyesToggles(props: Props): ReactElement {
  const { population, setPopulation } = props
  const { eyes } = population

  return (
    <Box sx={{ mb: 1 }} >
      <Typography id={ID} gutterBottom>
        Eyes
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
        <Grid item>
          <VisibilityIcon />
        </Grid>
        <Grid item xs>
          <ToggleButtonGroup
            value={eyes}
            onChange={onEyesChange}
            color="primary"
          >
            { EYES.map(({ name, value }) => (
              <ToggleButton key={name} value={value} aria-label={name}>
                <Eyes count={value} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Box>
  )

  function onEyesChange(_: MouseEvent, value: number[]): void {
    setPopulation(model => produce(model, draft => {
      draft.eyes = value.length ? value : DEFAULT_EYES
    }))
  }
}

interface EyesProps {
  count: number
}

function Eyes(props: EyesProps): ReactElement {
  const { count } = props

  return <div>{ count }</div>

  // drawEyes({ brush, center, context, eyes, pointer, scale: scale * baseScalar })
}

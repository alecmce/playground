import PentagonIcon from '@mui/icons-material/Pentagon'
import { Box, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { produce } from 'immer'
import { Dispatch, MouseEvent, ReactElement, SetStateAction } from 'react'
import { DEFAULT_SIDES, SIDES } from 'src/constants'
import { PopulationModel } from 'src/model/population'

interface Props {
  population:    PopulationModel
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
}

const ID = 'population-sides'

export function SidesToggles(props: Props): ReactElement {
  const { population, setPopulation } = props
  const { sides } = population

  return (
    <Box sx={{ mb: 1 }} >
      <Typography id={ID} gutterBottom>
        Sides
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
        <Grid item>
          <PentagonIcon />
        </Grid>
        <Grid item xs>
          <ToggleButtonGroup
            value={sides}
            onChange={onSidesChange}
            color="primary"
          >
            { SIDES.map(({ name, value }) => (
              <ToggleButton key={name} value={value} aria-label={name}>
                <Sides count={value} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Box>
  )

  function onSidesChange(_: MouseEvent, value: number[]): void {
    setPopulation(model => produce(model, draft => {
      draft.sides = value.length ? value : DEFAULT_SIDES
    }))
  }
}

interface SidesProps {
  count: number
}

function Sides(props: SidesProps): ReactElement {
  const { count } = props

  return <div>{ count }</div>

  // drawEyes({ brush, center, context, eyes, pointer, scale: scale * baseScalar })
}

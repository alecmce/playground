import Circle from '@mui/icons-material/Circle'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import { Box, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { produce } from 'immer'
import { Dispatch, MouseEvent, ReactElement, SetStateAction } from 'react'
import { COLORS } from 'src/constants'
import { PopulationModel } from 'src/model/population'

interface Props {
  population:    PopulationModel
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
}

const ID = 'population-colors'

export function ColorToggles(props: Props): ReactElement {
  const { population, setPopulation } = props
  const { colors } = population

  return (
    <Box sx={{ mb: 1 }} >
      <Typography id={ID} gutterBottom>
        Colors
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
        <Grid item>
          <ColorLensIcon />
        </Grid>
        <Grid item xs>
          <ToggleButtonGroup
            value={colors}
            onChange={onColorChange}
            color="primary"
          >
            { COLORS.map(({ name, value }) => (
              <ToggleButton key={name} value={value} aria-label={name}>
                <Circle sx={{ color: value }} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Box>
  )

  function onColorChange(_: MouseEvent, value: string[]): void {
    setPopulation(model => produce(model, draft => {
      draft.colors = value.length ? value : [COLORS[0].value]
    }))
  }
}

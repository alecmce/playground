import Circle from '@mui/icons-material/Circle'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import Button from '@mui/joy/Button'
import { Box, Grid, Typography } from '@mui/material'
import { produce } from 'immer'
import { Dispatch, ReactElement, SetStateAction } from 'react'
import { COLORS, DEFAULT_COLORS } from 'src/constants'
import { PopulationModel } from 'src/model/population'
import { TogglesGroup } from './StyledToggleGroup'

interface Props {
  population:    PopulationModel
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
  size:          number
}

const ID = 'population-colors'

export function ColorToggles(props: Props): ReactElement {
  const { population, setPopulation, size } = props
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
          <TogglesGroup value={colors} onChange={onColorChange}>
            { COLORS.map(renderColorButton) }
          </TogglesGroup>
        </Grid>
      </Grid>
    </Box>
  )

  function renderColorButton({ name, value }: { name: string, value: string }): ReactElement {
    return (
      <Button key={name} value={value} aria-label={name}>
        <Circle sx={{ color: value, width: size, height: size }} />
      </Button>
    )
  }

  function onColorChange(_: unknown, value: string[]): void {
    setPopulation(model => produce(model, draft => {
      draft.colors = value.length ? value : DEFAULT_COLORS
    }))
  }
}

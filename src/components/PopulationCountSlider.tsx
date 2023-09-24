import Groups3Icon from '@mui/icons-material/Groups3'
import { Box, Grid, Input, Slider, Typography } from '@mui/material'
import { produce } from 'immer'
import { ChangeEvent, Dispatch, ReactElement, SetStateAction } from 'react'
import { PopulationModel } from 'src/model/population'

interface Props {
  population:    PopulationModel
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
}

const ID = 'population-count-slider'

export function PopulationCountSlider(props: Props): ReactElement {
  const { population, setPopulation } = props
  const { count } = population

  return (
    <Box sx={{ mb: 1 }}>
      <Typography id={ID} gutterBottom>
        Count
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Groups3Icon />
        </Grid>
        <Grid item xs>
          <Slider
            value={count}
            onChange={onSliderChange}
            aria-labelledby={ID}
          />
        </Grid>
        <Grid item>
          <Input
            value={count}
            size="small"
            onChange={onInputChange}
            inputProps={{ 'aria-labelledby': ID, max: 100, min: 1, step: 5, type: 'number' }}
          />
        </Grid>
      </Grid>
    </Box>
  )

  function onSliderChange(_: Event, value: number | number[]): void {
    setPopulation(model => produce(model, draft => {
      draft.count = value as number
    }))
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>): void {
    const { target: { value } } = event
    setPopulation(model => produce(model, draft => {
      draft.count = value === '' ? 1 : Number(value)
    }))
  }
}

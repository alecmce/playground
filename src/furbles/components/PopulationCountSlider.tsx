import { Box, Input, Slider, Stack, Typography } from '@mui/joy'
import { produce } from 'immer'
import { ChangeEvent, Dispatch, ReactElement, SetStateAction } from 'react'
import { PopulationModel } from 'src/model/population'
import { PopulationIcon } from './Icons'

interface Props {
  population:    PopulationModel
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
  maxCount:      number
}

const ID = 'population-count-slider'

export function PopulationCountSlider(props: Props): ReactElement {
  const { population, setPopulation, maxCount } = props
  const { count } = population

  return (
    <Box sx={{ mb: 1 }}>
      <Typography gutterBottom>
        Count
      </Typography>
      <Stack spacing={2} direction="row" sx={{ mb: 1, alignItems: 'center' }}>
        <PopulationIcon />
        <Slider
          min={1}
          max={maxCount}
          value={count}
          onChange={onSliderChange}
          aria-labelledby={ID}
        />
        <Input
          value={count}
          onChange={onInputChange}
          slotProps={{ input: { max: maxCount, min: 1, step: 1, type: 'number' }}}
          sx={{ width: 100 }}
        />
      </Stack>
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

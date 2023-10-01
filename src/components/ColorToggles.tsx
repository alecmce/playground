import Circle from '@mui/icons-material/Circle'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import Button from '@mui/joy/Button'
import { produce } from 'immer'
import { Dispatch, ReactElement, SetStateAction } from 'react'
import { COLORS, DEFAULT_COLORS } from 'src/constants'
import { PopulationModel } from 'src/model/population'
import { TogglesGroup } from './TogglesGroup'

interface Props {
  population:    PopulationModel
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
  size:          number
}

export function ColorToggles(props: Props): ReactElement {
  const { population, setPopulation, size } = props
  const { colors } = population

  return (
    <TogglesGroup label="Colours" Icon={<ColorLensIcon />} value={colors} onChange={onColorChange}>
      { COLORS.map(renderColorButton) }
    </TogglesGroup>
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

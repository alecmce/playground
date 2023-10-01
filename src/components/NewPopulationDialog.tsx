import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { produce } from 'immer'
import { Dispatch, ReactElement, SetStateAction, useRef } from 'react'
import { DEFAULT_COLORS, DEFAULT_EYES, DEFAULT_SIDES } from 'src/constants'
import { PopulationModel } from 'src/model/population'
import { isDefined } from 'src/util/object-util'
import { ColorToggles } from './ColorToggles'
import { EyesToggles } from './EyesToggles'
import { PopulationCountSlider } from './PopulationCountSlider'
import { RandomizeButton } from './RandomizeButton'
import { SidesToggles } from './SidesToggles'

interface Props {
  population:    PopulationModel
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
  onClose:       VoidFunction
  maxCount:      number
}

const SIZE = 50

export function NewPopulationDialog(props: Props): ReactElement {
  const { onClose, population, setPopulation, maxCount } = props
  const { colors, eyes, sides } = population

  const original = useRef<PopulationModel>(population)

  return (
    <Dialog
      open={true}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>New Population</DialogTitle>
      <DialogContent>
        <PopulationCountSlider population={population} setPopulation={setPopulation} maxCount={maxCount} />
        <ColorToggles value={colors} onChange={onColorChange} size={SIZE} />
        <EyesToggles value={eyes} onChange={onEyesChange} size={SIZE} />
        <SidesToggles value={sides} onChange={onSidesChange} size={SIZE} />
        <RandomizeButton setPopulation={setPopulation} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel} color="secondary">Cancel</Button>
        <Button autoFocus onClick={onClose}>OK</Button>
      </DialogActions>
    </Dialog>
  )

  function onColorChange(value: string | string[] | null): void {
    const input = (Array.isArray(value) ? value : [value]).filter(isDefined)
    setPopulation(model => produce(model, draft => {
      draft.colors = input.length ? input : DEFAULT_COLORS
    }))
  }

  function onEyesChange(value: string | string[] | null): void {
    const input = (Array.isArray(value) ? value : [value]).filter(isDefined)
    setPopulation(model => produce(model, draft => {
      draft.eyes = input.length ? input : DEFAULT_EYES
    }))
  }

  function onSidesChange(value: string | string[] | null): void {
    const input = (Array.isArray(value) ? value : [value]).filter(isDefined)
    setPopulation(model => produce(model, draft => {
      draft.sides = input.length ? input : DEFAULT_SIDES
    }))
  }

  function onCancel(): void {
    setPopulation(original.current)
    onClose()
  }
}

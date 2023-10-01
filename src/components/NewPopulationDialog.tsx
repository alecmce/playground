import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { Dispatch, ReactElement, SetStateAction, useRef } from 'react'
import { PopulationModel } from 'src/model/population'
import { ColorToggles } from './ColorToggles'
import { EyesToggles } from './EyesToggles'
import { PopulationCountSlider } from './PopulationCountSlider'
import { RandomizeButton } from './RandomizeButton'
import { SidesToggles } from './SidesToggles'

interface Props {
  population:    PopulationModel
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
  onClose:       VoidFunction
}

const SIZE = 50

export function NewPopulationDialog(props: Props): ReactElement {
  const { onClose, population, setPopulation } = props

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
        <PopulationCountSlider population={population} setPopulation={setPopulation} />
        <ColorToggles population={population} setPopulation={setPopulation} size={SIZE} />
        <EyesToggles population={population} setPopulation={setPopulation} size={SIZE} />
        <SidesToggles population={population} setPopulation={setPopulation} size={SIZE} />
        <RandomizeButton setPopulation={setPopulation} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel} color="secondary">Cancel</Button>
        <Button autoFocus onClick={onClose}>OK</Button>
      </DialogActions>

    </Dialog>
  )

  function onCancel(): void {
    setPopulation(original.current)
    onClose()
  }
}

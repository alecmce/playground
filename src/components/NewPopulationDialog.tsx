import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { Dispatch, ReactElement, SetStateAction } from 'react'
import { PopulationModel } from 'src/model/population'
import { ColorToggles } from './ColorToggles'
import { EyesToggles } from './EyesToggles'
import { PopulationCountSlider } from './PopulationCountSlider'
import { SidesToggles } from './SidesToggles'

interface Props {
  population:    PopulationModel
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
}

export function NewPopulationDialog(props: Props): ReactElement {
  const { population, setPopulation } = props

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
        <ColorToggles population={population} setPopulation={setPopulation} />
        <EyesToggles population={population} setPopulation={setPopulation} />
        <SidesToggles population={population} setPopulation={setPopulation} />
      </DialogContent>
    </Dialog>
  )

  function onClose(): void {
  }
}

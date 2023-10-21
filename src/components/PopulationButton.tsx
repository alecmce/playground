import { ReactElement } from 'react'

import { Button } from '@mui/joy'
import { PopulationIcon } from './Icons'

interface Props {
  setShowDialog: (showDialog: boolean) => void
}

export function PopulationButton(props: Props): ReactElement {
  const { setShowDialog } = props

  return (
    <Button
      aria-label="setup population"
      color="success"
      onClick={onPopulationToggle}
      startDecorator={<PopulationIcon />}
      variant="solid"
    >
      Population
    </Button>
  )

  function onPopulationToggle(): void {
    setShowDialog(true)
  }
}

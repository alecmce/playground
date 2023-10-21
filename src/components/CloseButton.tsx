import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/joy'
import { ReactElement } from 'react'
import { AppStateAction, STATE_TYPE, jump } from 'src/model/app-state'


interface Props {
  dispatchAppState: (action: AppStateAction) => void
}

export function CloseButton(props: Props): ReactElement {
  const { dispatchAppState, } = props

  return (
    <IconButton aria-label="Cancel" onClick={onClose} variant="solid" color="neutral">
      <CloseIcon />
    </IconButton>
  )

  function onClose(): void {
    dispatchAppState(jump({ type: STATE_TYPE.FREE, time: 0 }))
  }
}

import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from '@mui/joy'
import { ReactElement } from 'react'


interface Props {
  onClose: VoidFunction
}

export function CloseButton(props: Props): ReactElement {
  const { onClose } = props

  return (
    <IconButton aria-label="Cancel" onClick={onClose} variant="solid" color="neutral">
      <CloseIcon />
    </IconButton>
  )
}

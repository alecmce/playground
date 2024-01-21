import { Refresh } from '@mui/icons-material'
import { IconButton } from '@mui/joy'
import { ReactElement } from 'react'

interface Props {
  label:   string
  onClick: VoidFunction
}

export function RefreshButton(props: Props): ReactElement {
  const { label, onClick } = props

  return (
    <IconButton aria-label={label} onClick={onClick} variant="solid" color="primary">
      <Refresh />
    </IconButton>
  )
}

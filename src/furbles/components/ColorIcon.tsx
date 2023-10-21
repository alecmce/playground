import Circle from '@mui/icons-material/Circle'
import { ReactElement } from 'react'

interface Props {
  size:  number
  value: string
}

export function ColorIcon(props: Props): ReactElement | null {
  const { size, value: color } = props

  return color ? <Circle sx={{ color, width: size, height: size }} /> : null
}

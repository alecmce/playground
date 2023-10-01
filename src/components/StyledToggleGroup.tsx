import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup'
import { ReactElement } from 'react'

interface Props {
  children: ReactElement[]
  value:    string[]
  onChange: (_: unknown, value: string[]) => void
}

export function TogglesGroup(props: Props): ReactElement {
  const { children, value, onChange } = props

  return (
    <ToggleButtonGroup
      color="neutral"
      onChange={onChange}
      spacing={{ xs: 0.2 }}
      sx={{ flexWrap: 'wrap' }}
      value={value}
      variant="soft"
    >
      { children }
    </ToggleButtonGroup>
  )
}

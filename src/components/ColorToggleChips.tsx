import { Box, Stack, Typography } from '@mui/joy'
import { ReactElement, useMemo } from 'react'
import { COLORS } from 'src/constants'
import { ColorIcon } from './ColorIcon'
import { ColorsIcon } from './Icons'
import { ToggleChips } from './ToggleChips'

interface Props {
  value:    string | string[] | null
  onChange: (colors: string | string[] | null) => void
  size:     number
  options?: Set<string>
}

export function ColorToggleChips(props: Props): ReactElement {
  const { options } = props

  const activeOptions = useMemo(() => options ? COLORS.filter(o => options.has(o.value)) : COLORS, [options])

  return (
    <Box sx={{ mb: 1 }} >
      <Typography gutterBottom>
      Colours
      </Typography>
      <Stack spacing={1} direction="row">
        <ColorsIcon />
        <ToggleChips
          { ...props}
          Option={ColorIcon}
          options={activeOptions}
        />
      </Stack>
    </Box>
  )
}

import { Stack, Typography } from '@mui/joy'
import Box from '@mui/joy/Box'
import { ReactElement, useMemo } from 'react'
import { SIDES } from 'src/constants'
import { SidesIcon } from './Icons'
import { NumberOfSides } from './NumberOfSides'
import { ToggleChips } from './ToggleChips'


interface Props {
  onChange:   (sides: string | string[] | null) => void
  options?:   Set<string>
  size:       number
  value:      string | string[] | null
}

export function SidesToggleChips(props: Props): ReactElement {
  const { options } = props

  const activeOptions = useMemo(() => options ? SIDES.filter(o => options.has(o.value)) : SIDES, [options])

  return (
    <Box sx={{ mb: 1 }} >
      <Typography gutterBottom>
        Sides
      </Typography>
      <Stack spacing={1} direction="row">
        <SidesIcon />
        <ToggleChips
          {...props}
          Option={NumberOfSides}
          options={activeOptions}
          multiline={true}
        />
      </Stack>
    </Box>
  )
}

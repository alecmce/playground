import { Stack, Typography } from '@mui/joy'
import Box from '@mui/joy/Box'
import { ReactElement, useMemo } from 'react'
import { EYES } from 'src/constants'
import { EyesIcon } from './Icons'
import { NumberOfEyes } from './NumberOfEyes'
import { ToggleChips } from './ToggleChips'

interface Props {
  onChange: (eyes: string | string[] | null) => void
  options?: Set<string>
  size:     number
  value:    string | string[] | null
}

export function EyesToggleChips(props: Props): ReactElement {
  const { options } = props

  const activeOptions = useMemo(() => options ? EYES.filter(o => options.has(o.value)) : EYES, [options])


  return (
    <Box sx={{ mb: 1 }} >
      <Typography gutterBottom>
        Eyes
      </Typography>
      <Stack spacing={1} direction="row">
        <EyesIcon />
        <ToggleChips
          {...props}
          Option={NumberOfEyes}
          options={activeOptions}
          multiline={true}
        />
      </Stack>
    </Box>
  )
}


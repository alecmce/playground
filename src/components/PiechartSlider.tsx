import { Slider, Stack } from '@mui/material'
import { ReactElement, useState } from 'react'

import Pause from '@mui/icons-material/Pause'
import PlayArrow from '@mui/icons-material/PlayArrow'

export function PiechartSlider(): ReactElement {
  const [value, setValue] = useState<number>(30)

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
      <Slider aria-label="Volume" value={value} onChange={onChange} />
      <PlayArrow />
      <Pause />
    </Stack>
  )

  function onChange(event: Event, newValue: number | number[]): void {
    setValue(newValue as number)
  }
}

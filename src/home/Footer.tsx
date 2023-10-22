import { Sheet, Stack } from '@mui/joy'
import { ReactElement } from 'react'
import { AboutMe } from './AboutMe'
import { KofiBanner } from './KofiBanner'


interface Props {
  size: number
}

export function Footer(props: Props): ReactElement {
  const { size } = props
  return (
    <Sheet sx={{position: 'absolute', bottom: 10, right: 10 }}>
      <Stack direction="row" spacing={2}>
        <AboutMe width={size} height={size} />
        <KofiBanner width={size} height={size} />
      </Stack>
    </Sheet>
  )
}

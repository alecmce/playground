import { Link, Stack, Typography } from '@mui/joy'
import { ReactElement } from 'react'

interface Props {
  width: number
  height: number
}


export function AboutMe(props: Props): ReactElement {
  return (
    <Link href="https://github.com/alecmce">
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography level='body-sm'>by Alec McEachran</Typography>
        <img {...props} src="/cartoon-profile-pic.png" alt="Cartoon of Alec" style={{ borderRadius: '100%' }} />
      </Stack>
    </Link>
  )
}

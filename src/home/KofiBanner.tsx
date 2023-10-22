import { Link, Stack, Typography } from '@mui/joy'
import { ReactElement } from 'react'

interface Props {
  width: number
  height: number
}

export function KofiBanner(props: Props): ReactElement {
  return (
    <Link href="https://ko-fi.com/alecmce">
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Typography level='body-sm'>support this project</Typography>
        <img {...props} src="/kofi_s_logo_nolabel.webp" alt="Kofi Logo" style={{ borderRadius: '100%' }} />
      </Stack>
    </Link>
  )
}

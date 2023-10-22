import { ReactElement } from 'react'

import { CSSObject } from '@emotion/react'
import { IconButton, Theme } from '@mui/joy'
import { HomeIcon } from './Icons'


export function HomeButton(): ReactElement {

  return (
    <IconButton component="a" href="/" variant="solid" color="warning" sx={sx}>
      <HomeIcon />
    </IconButton>
  )
}

function sx(theme: Theme): CSSObject {
  return { '&:hover': { color: theme.palette.primary.solidColor } }
}

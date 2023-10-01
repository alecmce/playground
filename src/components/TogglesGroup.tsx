import { Box } from '@mui/joy'
import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup'
import { Grid, Typography } from '@mui/material'
import { ReactElement, useRef } from 'react'

interface Props {
  children: ReactElement[]
  Icon:     ReactElement
  label:    string
  onChange: (_: unknown, value: string[]) => void
  value:    string[]
}

export function TogglesGroup(props: Props): ReactElement {
  const { children, Icon, label, onChange, value } = props

  const CachedIcon = useRef(Icon)

  return (
    <Box sx={{ mb: 1 }} >
      <Typography id={label} gutterBottom>
        { label }
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
        <Grid item>
          { CachedIcon.current }
        </Grid>
        <Grid item xs>
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
        </Grid>
      </Grid>
    </Box>
  )
}

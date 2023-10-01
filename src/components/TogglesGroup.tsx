import Box from '@mui/joy/Box'
import Button from '@mui/joy/Button'
import ToggleButtonGroup from '@mui/joy/ToggleButtonGroup'
import { Grid, Typography } from '@mui/material'
import { ReactElement, useRef } from 'react'

interface Props {
  Icon:     ReactElement
  label:    string
  onChange: (value: string | string[] | null) => void
  Option:   (props: OptionRenderProps) => ReactElement | null
  options:  OptionData[]
  size:     number
  value:    string | string[] | null
}

interface OptionData {
  value: string
  name:  string
}

interface OptionRenderProps {
  value: string
  size:  number
}

export function TogglesGroup(props: Props): ReactElement {
  const { Icon, label, onChange, Option, options, size, value } = props

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
            onChange={onToggleGroupChange}
            spacing={{ xs: 0.2 }}
            sx={{ flexWrap: 'wrap' }}
            value={value}
            variant="plain"
          >
            { options.map(renderButton) }
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Box>
  )

  function onToggleGroupChange(_: unknown, value: string | string[] | null): void {
    onChange(value)
  }

  function renderButton({ name, value }: OptionData): ReactElement {
    return (
      <Button aria-label={name} key={name} value={value}>
        <Option value={value} size={size} />
      </Button>
    )
  }
}

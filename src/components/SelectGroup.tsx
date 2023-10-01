import { ListItemDecorator } from '@mui/joy'
import Box from '@mui/joy/Box'
import MuiOption from '@mui/joy/Option'
import Select, { SelectOption } from '@mui/joy/Select'
import { Grid } from '@mui/material'
import { ReactElement, useRef } from 'react'

interface Props {
  Icon:     ReactElement
  name:     string
  onChange: (value: string | null) => void
  Option:   (props: OptionRenderProps) => ReactElement | null
  options:  OptionData[]
  size:     number
  value:    string | null
}

interface OptionData {
  value: string
  name:  string
}

interface OptionRenderProps {
  value: string
  size:  number
}

export function SelectGroup(props: Props): ReactElement {
  const { Icon, onChange, Option, options, size, value } = props

  const CachedIcon = useRef(Icon)

  return (
    <Box sx={{ mb: 1 }} >
      <Grid container spacing={2} alignItems="center" sx={{ justifyContent: 'center', flexWrap: 'nowrap' }}>
        <Grid item xs>
          { CachedIcon.current }
        </Grid>
        <Grid item xs>
          <Select<string>
            color="neutral"
            onChange={onToggleGroupChange}
            value={value}
            variant="plain"
            renderValue={renderValue}
            sx={{ width: 90 }}
          >
            <MuiOption label="None" value={null} />
            { options.map(renderOption) }
          </Select>
        </Grid>
      </Grid>
    </Box>
  )

  function onToggleGroupChange(_: unknown, value: string | null): void {
    onChange(value)
  }

  function renderValue(option: SelectOption<string> | null): ReactElement | null {
    return option ? render(option) : null

    function render(option: SelectOption<string>): ReactElement {
      const { value } = option
      return <Option value={value} size={size} />
    }
  }

  function renderOption(option: OptionData, index: number): ReactElement {
    const { name, value } = option
    return (
      <MuiOption label={name} key={`${index}`} value={value}>
        <ListItemDecorator>
          <Option value={value} size={size} />
        </ListItemDecorator>
        {name}
      </MuiOption>
    )
  }
}

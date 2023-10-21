import { CloseRounded } from '@mui/icons-material'
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown'
import { Grid, IconButton, ListItemDecorator } from '@mui/joy'
import Box from '@mui/joy/Box'
import MuiOption from '@mui/joy/Option'
import Select, { SelectOption } from '@mui/joy/Select'
import { MouseEvent, ReactElement } from 'react'

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

  return (
    <Box sx={{ mb: 1 }} >
      <Grid container spacing={2} alignItems="center" sx={{ justifyContent: 'center', flexWrap: 'nowrap' }}>
        <Select<string>
          color="neutral"
          onChange={onToggleGroupChange}
          value={value}
          variant="plain"
          renderValue={renderValue}
          sx={{ width: 120 }}
          startDecorator={value ? null : Icon}
          endDecorator={value ? EndDecorator() : null}
          indicator={value ? null : <KeyboardArrowDown />}
        >
          <MuiOption label="None" value={null} />
          { options.map(renderOption) }
        </Select>
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

  function EndDecorator(): ReactElement | null {
    return (
      <IconButton
        size="sm"
        variant="plain"
        color="neutral"
        onMouseDown={onMouseDown}
        onClick={onClick}
      >
        <CloseRounded />
      </IconButton>
    )

    // don't open the popup when clicking on this button
    function onMouseDown(event: MouseEvent<unknown>): void {
      event.stopPropagation()
    }

    function onClick(): void {
      onChange(null)
    }
  }
}

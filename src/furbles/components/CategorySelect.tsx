import BlockIcon from '@mui/icons-material/Block'
import { ListItemDecorator } from '@mui/joy'
import Box from '@mui/joy/Box'
import Option from '@mui/joy/Option'
import Select, { SelectOption } from '@mui/joy/Select'
import { ReactElement, SyntheticEvent, useRef } from 'react'
import { CATEGORY } from 'src/model/creatures'

interface Props {
  category: CATEGORY
  label:    string
  onChange: (category: CATEGORY, value: string | null) => void
  Option:   (value: string) => ReactElement
  options:  Array<{ name: string, value: string }>
  size:     number
  value:    string | null
}

export function CategorySelect(props: Props): ReactElement {
  const { category, label, onChange, Option: OptionFactory, options, size, value } = props

  const CachedOptions = useRef(options.map(option => (
    <Option key={option.name} value={option.value}>
      { OptionFactory(option.value) }
      <Box sx={{marginLeft: 1}}>
        { option.name }
      </Box>
    </Option>
  )))

  return (
    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
      <Select defaultValue="none" startDecorator={label} renderValue={renderValue} value={value} onChange={onSelect}>
        <Option value="none"><BlockIcon sx={{ width: size, height: size }} /></Option>
        { CachedOptions.current }
      </Select>
    </Box>
  )

  function renderValue(option: SelectOption<string> | null): ReactElement | null {
    return option ? render(option) : null

    function render(option: SelectOption<string>): ReactElement {
      return option.value === 'none' ? renderNone() : renderOption(option)
    }

    function renderNone(): ReactElement {
      return <BlockIcon sx={{ width: size, height: size }} />
    }

    function renderOption(option: SelectOption<string>): ReactElement {
      return (
        <ListItemDecorator>
          { OptionFactory(option.value) }
        </ListItemDecorator>
      )
    }
  }

  function onSelect(_: SyntheticEvent | null, value: string | null): void {
    onChange(category, value)
  }
}

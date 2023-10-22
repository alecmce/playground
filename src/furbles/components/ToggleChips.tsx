import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'
import { Chip, Stack } from '@mui/joy'
import { ReactElement, useMemo } from 'react'

interface Props<T extends string = string> {
  multiline?: boolean
  onChange:   (value: T | T[] | null) => void
  Option:     (props: OptionRenderProps<T>) => ReactElement | null
  options:    OptionData<T>[]
  size:       number
  value:      T | T[] | null
}

export interface OptionData<T extends string = string> {
  name:  string
  value: T
}

export interface OptionRenderProps<T> {
  size:  number
  value: T
}

export function ToggleChips<T extends string = string>(props: Props<T>): ReactElement {
  const { multiline, onChange, Option, options, size, value } = props

  return (
    <Stack direction="row" flexWrap="wrap">
      { options.map(({ name, value: chipValue }) => (
        <ToggleChip
          chipValue={chipValue}
          key={name}
          multiline={multiline}
          name={name}
          onChange={onChange}
          Option={Option}
          size={size}
          value={value}
        />
      )) }
    </Stack>
  )
}

interface ToggleChipProps<T extends string = string> {
  chipValue:  T
  multiline?: boolean
  name:       string
  onChange:   (value: T | T[] | null) => void
  Option:     (props: OptionRenderProps<T>) => ReactElement | null
  size:       number
  value:      T | T[] | null
}

function ToggleChip<T extends string = string>(props: ToggleChipProps<T>): ReactElement {
  const { chipValue, multiline, name, onChange, Option, size, value } = props

  const isSelected = useMemo(() => {
    return chipValue === value || Array.isArray(value) && value.includes(chipValue)
  }, [chipValue, value])

  return (
    <Chip
      endDecorator={isSelected ? <Check fontSize="sm" /> : <Close fontSize="sm" />}
      onClick={onClick}
      startDecorator={<Option value={chipValue} size={size} />}
      sx={{ marginBottom: multiline ? '4px' : 0, marginRight: '4px' }}
      color={isSelected ? 'primary' : 'neutral'}
    >
      {name}
    </Chip>
  )

  function onClick(): void {
    onChange(toggleValue())
  }

  function toggleValue(): T | T[] | null {
    if (Array.isArray(value)) {
      return value.includes(chipValue) ? value.filter(v => v !== chipValue) : [...value, chipValue]
    } else {
      return value === chipValue ? null : chipValue
    }
  }
}

import Check from '@mui/icons-material/Check'
import Close from '@mui/icons-material/Close'
import { Chip, Stack } from '@mui/joy'
import { ReactElement, useMemo } from 'react'

interface Props {
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

export function ToggleChips(props: Props): ReactElement {
  const { onChange, Option, options, size, value } = props

  return (
    <Stack direction="row" flexWrap="wrap">
      { options.map(({ name, value: chipValue }) => (
        <ToggleChip
          chipValue={chipValue}
          key={name}
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

interface ToggleChipProps {
  chipValue: string
  name:      string
  onChange:  (value: string | string[] | null) => void
  Option:    (props: OptionRenderProps) => ReactElement | null
  size:      number
  value:     string | string[] | null
}

function ToggleChip(props: ToggleChipProps): ReactElement {
  const { name, onChange, Option, size, chipValue, value } = props

  const endDecorator = useMemo(() => {
    return chipValue === value || Array.isArray(value) && value.includes(chipValue)
      ? <Check fontSize="small" />
      : <Close fontSize="small" />
  }, [chipValue, value])

  return (
    <Chip
      endDecorator={endDecorator}
      onClick={onClick}
      startDecorator={<Option value={chipValue} size={size} />}
      sx={{ marginBottom: '4px', marginRight: '4px' }}
    >
      {name}
    </Chip>
  )

  function onClick(): void {
    onChange(toggleValue())
  }

  function toggleValue(): string | string[] | null {
    if (Array.isArray(value)) {
      return value.includes(chipValue) ? value.filter(v => v !== chipValue) : [...value, chipValue]
    } else {
      return value === chipValue ? null : chipValue
    }
  }
}

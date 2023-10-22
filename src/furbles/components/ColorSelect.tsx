import { ReactElement, useMemo } from 'react'
import { COLORS } from 'src/furbles/constants'
import { ColorIcon } from './ColorIcon'
import { ColorsIcon } from './Icons'
import { SelectGroup } from './SelectGroup'

interface Props {
  value:    string | null
  onChange: (colors: string | string[] | null) => void
  size:     number
  options?: Set<string>
}

export function ColorSelect(props: Props): ReactElement {
  const { options } = props

  const activeOptions = useMemo(() => options ? COLORS.filter(o => options.has(o.value)) : COLORS, [options])

  return (
    <SelectGroup
      {...props}
      Icon={<ColorsIcon color="neutral" />}
      name="Colour"
      Option={ColorIcon}
      options={activeOptions}
    />
  )
}

import { ReactElement, useMemo } from 'react'
import { SIDES } from 'src/furbles/constants'
import { SidesIcon } from './Icons'
import { NumberOfSides } from './NumberOfSides'
import { SelectGroup } from './SelectGroup'

interface Props {
  onChange:   (sides: string | null) => void
  options?:   Set<string>
  size:       number
  value:      string | null
}

export function SidesSelect(props: Props): ReactElement {
  const { options } = props

  const activeOptions = useMemo(() => options ? SIDES.filter(o => options.has(o.value)) : SIDES, [options])

  return (
    <SelectGroup
      {...props}
      name="Sides"
      Icon={<SidesIcon color="info" />}
      Option={NumberOfSides}
      options={activeOptions}
    />
  )
}

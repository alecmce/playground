import { ReactElement, useMemo } from 'react'
import { EYES } from 'src/furbles/constants'
import { EyesIcon } from './Icons'
import { NumberOfEyes } from './NumberOfEyes'
import { SelectGroup } from './SelectGroup'

interface Props {
  onChange: (eyes: string | null) => void
  options?: Set<string>
  size:     number
  value:    string | null
}

export function EyesSelect(props: Props): ReactElement {
  const { options } = props

  const activeOptions = useMemo(() => options ? EYES.filter(o => options.has(o.value)) : EYES, [options])

  return (
    <SelectGroup
      {...props}
      Icon={<EyesIcon color="info" />}
      name="Eyes"
      Option={NumberOfEyes}
      options={activeOptions}
    />
  )
}


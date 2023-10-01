import VisibilityIcon from '@mui/icons-material/Visibility'
import { ReactElement, useMemo } from 'react'
import { EYES } from 'src/constants'
import { EyesIcon } from './EyesIcon'
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
      Icon={<VisibilityIcon />}
      name="Eyes"
      Option={EyesIcon}
      options={activeOptions}
    />
  )
}


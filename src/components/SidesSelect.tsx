import PentagonIcon from '@mui/icons-material/Pentagon'
import { ReactElement, useMemo } from 'react'
import { SIDES } from 'src/constants'
import { SelectGroup } from './SelectGroup'
import { SidesIcon } from './SidesIcon'

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
      Icon={<PentagonIcon />}
      Option={SidesIcon}
      options={activeOptions}
    />
  )
}

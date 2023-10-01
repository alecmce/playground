import PentagonIcon from '@mui/icons-material/Pentagon'
import { ReactElement, useMemo } from 'react'
import { SIDES } from 'src/constants'
import { SidesIcon } from './SidesIcon'
import { TogglesGroup } from './TogglesGroup'

interface Props {
  onChange:   (sides: string | string[] | null) => void
  options?:   Set<string>
  size:       number
  value:      string | string[] | null
}

export function SidesToggles(props: Props): ReactElement {
  const { options } = props

  const activeOptions = useMemo(() => options ? SIDES.filter(o => options.has(o.value)) : SIDES, [options])

  return (
    <TogglesGroup
      {...props}
      Icon={<PentagonIcon />}
      label="Sides"
      Option={SidesIcon}
      options={activeOptions}
    />
  )
}

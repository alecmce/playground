import VisibilityIcon from '@mui/icons-material/Visibility'
import { ReactElement, useMemo } from 'react'
import { EYES } from 'src/constants'
import { EyesIcon } from './EyesIcon'
import { TogglesGroup } from './TogglesGroup'

interface Props {
  onChange: (eyes: string | string[] | null) => void
  options?: Set<string>
  size:     number
  value:    string | string[] | null
}

export function EyesToggles(props: Props): ReactElement {
  const { options } = props

  const activeOptions = useMemo(() => options ? EYES.filter(o => options.has(o.value)) : EYES, [options])


  return (
    <TogglesGroup
      {...props}
      Icon={<VisibilityIcon />}
      label="Eyes"
      Option={EyesIcon}
      options={activeOptions}
    />
  )
}


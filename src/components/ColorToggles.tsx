import { ReactElement, useMemo } from 'react'
import { COLORS } from 'src/constants'
import { ColorIcon } from './ColorIcon'
import { ColorsIcon } from './Icons'
import { TogglesGroup } from './TogglesGroup'

interface Props {
  value:    string | string[] | null
  onChange: (colors: string | string[] | null) => void
  size:     number
  options?: Set<string>
}

export function ColorToggles(props: Props): ReactElement {
  const { options } = props

  const activeOptions = useMemo(() => options ? COLORS.filter(o => options.has(o.value)) : COLORS, [options])

  return (
    <TogglesGroup
      { ...props}
      Icon={<ColorsIcon />}
      label="Colours"
      Option={ColorIcon}
      options={activeOptions}
    />
  )
}

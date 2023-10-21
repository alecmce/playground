import { Dispatch, ReactElement, SetStateAction, memo } from 'react'

import { Stack } from '@mui/joy'
import Sheet from '@mui/joy/Sheet'
import { produce } from 'immer'
import { CATEGORY, SetInclusionState } from 'src/model/creatures'
import { ColorSelect } from './ColorSelect'
import { EyesSelect } from './EyesSelect'
import { SidesSelect } from './SidesSelect'


interface Props {
  Icon:      ReactElement
  setValues: Dispatch<SetStateAction<SetInclusionState>>
  size:      number
  values:    SetInclusionState
}

export const SetInclusionStatePicker = memo(Component)

function Component(props: Props): ReactElement {
  const { Icon, setValues, size, values } = props

  return (
    <Stack spacing={1} direction="row" sx={{ alignItems: 'center' }}>
      { Icon }
      <Sheet variant="soft" color="neutral" sx={{ alignItems: 'center', padding: 2 }}>
        <Stack spacing={1} direction="column">
          <Stack spacing={3} direction="row" sx={{ mb: 0, justifyContent: 'center' }}>
            <ColorSelect value={values.color ?? null} onChange={onColorChange} size={size} />
            <EyesSelect value={values.eyes ?? null} onChange={onEyesChange} size={size} />
            <SidesSelect value={values.sides ?? null} onChange={onSidesChange} size={size} />
          </Stack>
        </Stack>
      </Sheet>
    </Stack>
  )

  function onColorChange(value: string | string[] | null): void {
    setValues(model => produce(model, draft => {
      value?.length
        ? draft[CATEGORY.COLOR] = Array.isArray(value) ? value.at(0) : value
        : delete draft[CATEGORY.COLOR]
    }))
  }

  function onEyesChange(value: string | string[] | null): void {
    setValues(model => produce(model, draft => {
      value?.length
        ? draft[CATEGORY.EYES] = Array.isArray(value) ? value.at(0) : value
        : delete draft[CATEGORY.EYES]
    }))
  }

  function onSidesChange(value: string | string[] | null): void {
    setValues(model => produce(model, draft => {
      value?.length
        ? draft[CATEGORY.SIDES] = Array.isArray(value) ? value.at(0) : value
        : delete draft[CATEGORY.SIDES]
    }))
  }
}

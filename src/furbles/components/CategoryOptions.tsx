import { ReactElement } from 'react'

import PlayArrow from '@mui/icons-material/PlayArrow'
import { IconButton, Stack } from '@mui/joy'
import { CATEGORY, CategoryOptionList } from 'src/model/creatures'
import { ColorsIcon, EyesIcon, SidesIcon } from './Icons'
import { OptionRenderProps, ToggleChips } from './ToggleChips'


interface Props {
  ['aria-label']: string
  categories:     CATEGORY[]
  setCategories:  (categories: CATEGORY[]) => void
  onClick:        VoidFunction
}

export function CategoryOptions(props: Props): ReactElement {
  const { categories, setCategories, onClick } = props

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center' }}>
      <ToggleChips<CATEGORY>
        onChange={toggleCategory}
        Option={Option}
        options={CategoryOptionList}
        size={50}
        value={categories}
      />
      <IconButton aria-label={props['aria-label']} onClick={onClick}>
        <PlayArrow />
      </IconButton>
    </Stack>
  )

  function toggleCategory(categories: CATEGORY | CATEGORY[] | null): void {
    setCategories(getValue())

    function getValue(): CATEGORY[] {
      if (Array.isArray(categories)) {
        return categories
      } else if (categories) {
        return [categories]
      } else {
        return []
      }
    }
  }
}

function Option(props: OptionRenderProps<CATEGORY>): ReactElement | null {
  const { value } = props

  switch (value) {
    case CATEGORY.COLOR: return <ColorsIcon color="primary" />
    case CATEGORY.SIDES: return <SidesIcon color="primary" />
    case CATEGORY.EYES:  return <EyesIcon color="primary" />
    default:             return null
  }
}

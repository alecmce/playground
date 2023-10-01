import { Checkbox, FormControlLabel, IconButton, Stack } from '@mui/material'
import { Dispatch, ReactElement, SetStateAction } from 'react'

import Palette from '@mui/icons-material/Palette'
import PaletteOutlined from '@mui/icons-material/PaletteOutlined'
import Pentagon from '@mui/icons-material/Pentagon'
import PentagonOutlined from '@mui/icons-material/PentagonOutlined'
import PlayArrow from '@mui/icons-material/PlayArrow'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined'
import { CATEGORY } from 'src/model/creatures'


interface Props {
  ['aria-label']: string
  categories:     Set<CATEGORY>
  setCategories:  Dispatch<SetStateAction<Set<CATEGORY>>>
  onClick:        VoidFunction
}

export function CategoryOptions(props: Props): ReactElement {
  const { categories, setCategories, onClick } = props

  return (
    <Stack spacing={2} direction="row" sx={{ mb: 0, justifyContent: 'center' }}>
      <FormControlLabel
        checked={categories.has(CATEGORY.COLOR)}
        control={ <Checkbox icon={<PaletteOutlined />} checkedIcon={<Palette />} />}
        label="Colour"
        labelPlacement="end"
        color="secondary"
        onChange={(_, isChecked) => toggleCategory(CATEGORY.COLOR, isChecked)}
      />
      <FormControlLabel
        checked={categories.has(CATEGORY.SIDES)}
        control={ <Checkbox icon={<PentagonOutlined />} checkedIcon={<Pentagon />} />}
        label="Shape"
        labelPlacement="end"
        color="secondary"
        onChange={(_, isChecked) => toggleCategory(CATEGORY.SIDES, isChecked)}
      />
      <FormControlLabel
        checked={categories.has(CATEGORY.EYES)}
        control={ <Checkbox icon={<VisibilityOutlined />} checkedIcon={<Visibility />} />}
        label="Eyes"
        labelPlacement="end"
        color="secondary"
        onChange={(_, isChecked) => toggleCategory(CATEGORY.EYES, isChecked)}
      />
      <IconButton aria-label={props['aria-label']} size="large" onClick={onClick}>
        <PlayArrow />
      </IconButton>
    </Stack>
  )

  function toggleCategory(category: CATEGORY, isChecked: boolean): void {
    setCategories(categories => {
      const set = new Set(categories)
      isChecked ? set.add(category) : set.delete(category)
      if (set.size === 0) {
        set.add(CATEGORY.COLOR)
      }
      return set
    })
  }
}

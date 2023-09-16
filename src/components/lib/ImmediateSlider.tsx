import Slider from '@mui/material/Slider'
import { styled } from '@mui/material/styles'

const STYLES = {
  '& .MuiSlider-thumb': {
    transition: 'none'
  },
  '& .MuiSlider-track': {
    transition: 'none'
  },
}

export const ImmediateSlider = styled(Slider)(() => STYLES)

import VisibilityIcon from '@mui/icons-material/Visibility'
import { Box, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { produce } from 'immer'
import { Dispatch, MouseEvent, ReactElement, SetStateAction, useEffect, useState } from 'react'
import { DEFAULT_EYES, EYES } from 'src/constants'
import { drawEyes } from 'src/draw/draw-eye'
import { Point } from 'src/model/geometry'
import { PopulationModel } from 'src/model/population'

interface Props {
  population:    PopulationModel
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
  size:          number
}

const ID = 'population-eyes'

export function EyesToggles(props: Props): ReactElement {
  const { population, setPopulation, size } = props
  const { eyes } = population

  return (
    <Box sx={{ mb: 1 }} >
      <Typography id={ID} gutterBottom>
        Eyes
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
        <Grid item>
          <VisibilityIcon />
        </Grid>
        <Grid item xs>
          <ToggleButtonGroup
            value={eyes}
            onChange={onEyesChange}
            color="primary"
            sx={{ flexWrap: 'wrap', padding: 2 }}
          >
            { EYES.map(({ name, value }) => (
              <ToggleButton key={name} value={value} aria-label={name}>
                <Eyes eyes={value} size={size} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Box>
  )

  function onEyesChange(_: MouseEvent, value: number[]): void {
    setPopulation(model => produce(model, draft => {
      draft.eyes = value.length ? value : DEFAULT_EYES
    }))
  }
}

const BRUSH = { alpha: 1, color: 'black', width: 1 } as const

interface EyesProps {
  eyes: number
  size: number
}

function Eyes(props: EyesProps): ReactElement {
  const { eyes, size } = props

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [pointer, setPointer] = useState<Point>({ x: size / 2, y: size / 2 })

  useEffect(() => {
    let center: Point
    if (canvas) {
      const p = canvas.getBoundingClientRect()
      center = { x: (p.left + p.right) / 2 - size / 2, y: (p.top + p.bottom) / 2 - size / 2 }
      window.addEventListener('pointermove', onPointerMove)
    }

    return function unmount(): void {
      window.removeEventListener('pointermove', onPointerMove)
    }

    function onPointerMove(event: PointerEvent): void {
      setPointer({ x: event.clientX - center.x, y: event.clientY - center.y })
    }
  }, [canvas])

  const context = canvas?.getContext('2d')
  if (context) {
    drawEyes({
      brush: BRUSH,
      center: { x: size / 2, y: size / 2 },
      context,
      eyes: eyes,
      pointer,
      scale: size / 70,
    })
  }

  return (
    <canvas ref={setCanvas} width={size} height={size} style={{width: size, height: size }} />
  )
}

import PentagonIcon from '@mui/icons-material/Pentagon'
import { Box, Grid, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { produce } from 'immer'
import { Dispatch, MouseEvent, ReactElement, SetStateAction, useMemo, useState } from 'react'
import { DEFAULT_SIDES, SIDES } from 'src/constants'
import { drawPolygon } from 'src/draw/draw-polygon'
import { makeRegularPolygon } from 'src/lib/regular-polygon'
import { PopulationModel } from 'src/model/population'

interface Props {
  population:    PopulationModel
  setPopulation: Dispatch<SetStateAction<PopulationModel>>
  size:          number
}

const ID = 'population-sides'

export function SidesToggles(props: Props): ReactElement {
  const { population, setPopulation, size } = props
  const { sides } = population

  return (
    <Box sx={{ mb: 1 }} >
      <Typography id={ID} gutterBottom>
        Sides
      </Typography>
      <Grid container spacing={2} alignItems="center" sx={{ flexWrap: 'nowrap' }}>
        <Grid item>
          <PentagonIcon />
        </Grid>
        <Grid item xs>
          <ToggleButtonGroup
            value={sides}
            onChange={onSidesChange}
            color="primary"
            sx={{ flexWrap: 'wrap', padding: 2 }}
          >
            { SIDES.map(({ name, value }) => (
              <ToggleButton key={name} value={value} aria-label={name}>
                <Sides sides={value} size={size} />
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Grid>
      </Grid>
    </Box>
  )

  function onSidesChange(_: MouseEvent, value: number[]): void {
    setPopulation(model => produce(model, draft => {
      draft.sides = value.length ? value : DEFAULT_SIDES
    }))
  }
}

const BRUSH = { alpha: 1, color: 'black', width: 1 } as const

interface SidesProps {
  sides: number
  size: number
}

function Sides(props: SidesProps): ReactElement {
  const { sides, size } = props

  const polygon = useMemo(() => makeRegularPolygon({
    center: { x: 0, y: 0 },
    radius: size / 2,
    sides,
  }), [sides, size])

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

  const context = canvas?.getContext('2d')
  if (context) {
    drawPolygon({
      brush: BRUSH,
      center: { x: size / 2, y: size / 2 },
      context,
      polygon,
      scale: size / 70,
    })
  }

  return (
    <canvas ref={setCanvas} width={size} height={size} style={{width: size, height: size }} />
  )
}

import PentagonIcon from '@mui/icons-material/Pentagon'
import Button from '@mui/joy/Button'
import { Box, Grid, Typography } from '@mui/material'
import { produce } from 'immer'
import { Dispatch, ReactElement, SetStateAction, useMemo, useState } from 'react'
import { DEFAULT_SIDES, SIDES } from 'src/constants'
import { drawPolygon } from 'src/draw/draw-polygon'
import { makeRegularPolygon } from 'src/lib/regular-polygon'
import { PopulationModel } from 'src/model/population'
import { TogglesGroup } from './StyledToggleGroup'

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
          <TogglesGroup value={sides} onChange={onSidesChange}>
            { SIDES.map(renderSidesButton) }
          </TogglesGroup>
        </Grid>
      </Grid>
    </Box>
  )

  function renderSidesButton({ name, value }: { name: string, value: string }): ReactElement {
    return (
      <Button key={name} value={value} aria-label={name}>
        <Sides sides={value} size={size} />
      </Button>
    )
  }

  function onSidesChange(_: unknown, value: string[]): void {
    setPopulation(model => produce(model, draft => {
      draft.sides = value.length ? value : DEFAULT_SIDES
    }))
  }
}

const BRUSH = { alpha: 1, color: 'black', width: 2 } as const

interface SidesProps {
  sides: string
  size:  number
}

function Sides(props: SidesProps): ReactElement {
  const { sides, size } = props

  const polygon = useMemo(() => makeRegularPolygon({
    center: { x: 0, y: 0 },
    radius: size / 2,
    sides: parseInt(sides, 10),
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

import { Fragment, ReactElement, useCallback, useState } from 'react'
import { drawFurbles } from 'src/draw-furbles'
import { useDrawingApi } from '../draw/drawing-api'
import { useAppState } from '../lib/app-state'
import { useCreatureFactory } from '../lib/creature-factory'
import { useCreatures } from '../lib/creatures'
import { usePushApart } from '../lib/push-apart'
import { useCreatureInteraction } from '../lib/use-creature-interaction'
import { useRadius } from '../lib/use-radius'
import { useTick } from '../lib/use-tick'
import { useWindowSize } from '../lib/use-window-size'
import { iterate } from '../model/app-state'
import { Creature } from '../model/creatures'
import { Point } from '../model/geometry'
import { PopulationModel } from '../model/population'
import { useBounds } from '../use-bounds'
import { useCurrentChart } from '../use-current-chart'
import { useInitCanvas } from '../use-init-canvas'
import { useBarChart } from './bar-chart/bar-chart'
import { useCarrollDiagram } from './carroll-diagram/carroll-diagram'
import { Ui } from './components/UI'
import { useCurrentPuzzle } from './components/use-current-puzzle'
import { makeDefaultPopulation } from './constants'
import { HANDS } from './lib/draw-hands'
import { useWaves } from './lib/waves'
import { usePieChart } from './pie-chart/pie-chart'
import { useVennDiagram } from './venn-diagram/venn-diagram'

const BRUSH = { alpha: 1, color: 'black', width: 3 } as const
const DENSITY = 0.5 as const
const MAX_COUNT = 400 as const
const WAVE_DURATION = 1.5 as const

export function Furbles(): ReactElement {
  const [showDialog, setShowDialog] = useState(false)

  const [population, setPopulation] = useState<PopulationModel>(makeDefaultPopulation())
  const { count } = population

  const size = useWindowSize()
  const { width, height } = size

  const [, context, setCanvas] = useInitCanvas({ alpha: false })
  const [target, setTarget] = useState<Creature | null>(null)
  const [state, dispatchAppState] = useAppState()

  const drawingApi = useDrawingApi({ brush: BRUSH, context })
  const bounds = useBounds(size)
  const radius = useRadius({ count, density: DENSITY, size })
  const makeCreatures = useCreatureFactory({ bounds, brush: BRUSH, drawingApi, maxCount: MAX_COUNT, radius })
  const creatures = useCreatures({ makeCreatures, population })
  const pushApart = usePushApart({ creatures })
  const barChart = useBarChart({ bounds, creatures, drawingApi, radius })
  const pieChart = usePieChart({ bounds, count, creatures, drawingApi, radius })
  const carrollDiagram = useCarrollDiagram({ bounds, creatures, drawingApi, radius })
  const vennDiagram = useVennDiagram({ bounds, creatures, drawingApi, radius })
  const waves = useWaves({ brush: BRUSH, drawingApi, duration: WAVE_DURATION })
  const puzzle = useCurrentPuzzle({ bounds, drawingApi, makeCreatures, puzzle: state.puzzle })

  const [pointer, setPointer] = useState<Point | null>(null)

  const chart = useCurrentChart({ type: state.chart, barChart, carrollDiagram, pieChart })
  const onClick = useCallback((creature: Creature | null) => creature && waves?.apply(creature, HANDS.BOTH), [waves])
  useCreatureInteraction({ chart, creatures, enabled: !showDialog, onClick, setPointer, setTarget })

  const tick = useCallback((deltaTime: number) => {
    dispatchAppState(iterate(deltaTime))
  }, [dispatchAppState])

  useTick(tick)

  if (drawingApi) {
    drawFurbles({
      barChart, brush: BRUSH, carrollDiagram, creatures, drawingApi, pieChart, pointer, pushApart, puzzle, radius, size,
      state, target, vennDiagram,
    })
  }
  waves?.update(Date.now() / 1000)

  return (
    <Fragment>
      <canvas
        ref={setCanvas}
        width={width}
        height={height}
        style={{ position: 'absolute', width, height: height, left: 0, top: 0 }}
      />
      <Ui
        barChart={barChart}
        carrollDiagram={carrollDiagram}
        dispatchAppState={dispatchAppState}
        makeCreatures={makeCreatures}
        maxCount={MAX_COUNT}
        pieChart={pieChart}
        population={population}
        setPopulation={setPopulation}
        setShowDialog={setShowDialog}
        showDialog={showDialog}
        state={state}
        vennDiagram={vennDiagram}
        puzzleName={puzzle?.name ?? ''}
      />
    </Fragment>
  )

}

import { Fragment, ReactElement, useCallback, useState } from 'react'
import './App.css'
import { useBarChart } from './bar-chart/bar-chart'
import { useCarrollDiagram } from './carroll-diagram/carroll-diagram'
import { Ui } from './components/UI'
import { makeDefaultPopulation } from './constants'
import { draw } from './draw'
import { useDrawingApi } from './draw/drawing-api'
import { useAppState } from './lib/app-state'
import { useCreatureFactory } from './lib/creature-factory'
import { useCreatures } from './lib/creatures'
import { usePushApart } from './lib/push-apart'
import { useCreaturesDrag } from './lib/use-creatures-drag'
import { useRadius } from './lib/use-radius'
import { useTick } from './lib/use-tick'
import { useWindowSize } from './lib/use-window-size'
import { iterate } from './model/app-state'
import { Creature } from './model/creatures'
import { Point } from './model/geometry'
import { PopulationModel } from './model/population'
import { usePieChart } from './pie-chart/pie-chart'
import { useBounds } from './use-bounds'
import { useCurrentChart } from './use-current-chart'
import { useInitCanvas } from './use-init-canvas'
import { useVennDiagram } from './venn-diagram/venn-diagram'

const BRUSH = { alpha: 1, color: 'black', width: 3 } as const
const DENSITY = 0.5 as const
const MAX_COUNT = 400 as const

export function App(): ReactElement {
  const [showDialog, setShowDialog] = useState(false)

  const [population, setPopulation] = useState<PopulationModel>(makeDefaultPopulation())
  const { count } = population

  const size = useWindowSize()
  const { width, height } = size

  const [, context, setCanvas] = useInitCanvas({ alpha: false })
  const [target, setTarget] = useState<Creature | null>(null)
  const [state, dispatchAppState] = useAppState()

  const drawingApi = useDrawingApi({ context })
  const bounds = useBounds(size)
  const makeCreatures = useCreatureFactory({ drawingApi, maxCount: MAX_COUNT })
  const radius = useRadius({ count, density: DENSITY, size })
  const creatures = useCreatures({ brush: BRUSH, makeCreatures, population, radius, bounds })
  const pushApart = usePushApart({ creatures })
  const barChart = useBarChart({ bounds, creatures, drawingApi, radius })
  const pieChart = usePieChart({ bounds, count, creatures, drawingApi, radius })
  const carrollDiagram = useCarrollDiagram({ bounds, creatures, drawingApi, radius })
  const vennDiagram = useVennDiagram({ bounds, creatures, drawingApi, radius })

  const [pointer, setPointer] = useState<Point | null>(null)

  const chart = useCurrentChart({ type: state.chart, barChart, carrollDiagram, pieChart })
  useCreaturesDrag({ chart, creatures, enabled: !showDialog, setPointer, setTarget })

  const tick = useCallback((deltaTime: number) => {
    dispatchAppState(iterate(deltaTime))
  }, [dispatchAppState])

  useTick(tick)

  draw({
    barChart, carrollDiagram, creatures, drawingApi, pieChart, pointer, pushApart, radius, size, state, vennDiagram,
    target,
  })

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
        pieChart={pieChart}
        population={population}
        setPopulation={setPopulation}
        setShowDialog={setShowDialog}
        showDialog={showDialog}
        state={state}
        maxCount={MAX_COUNT}
        vennDiagram={vennDiagram}
      />
    </Fragment>
  )
}

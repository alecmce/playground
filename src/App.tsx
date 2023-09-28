import { Fragment, ReactElement, useCallback, useMemo, useState } from 'react'
import './App.css'
import { makeBarChart } from './bar-chart/bar-chart'
import { Ui } from './components/UI'
import { draw } from './draw'
import { useAppState } from './lib/app-state'
import { makeCreatureFactory } from './lib/creatures'
import { makePushApart } from './lib/push-apart'
import { makeSeededRandom } from './lib/seeded-random'
import { useCreaturesDrag } from './lib/use-creatures-drag'
import { useRadius } from './lib/use-radius'
import { useTick } from './lib/use-tick'
import { useWindowSize } from './lib/use-window-size'
import { iterate } from './model/app-state'
import { Creature } from './model/creatures'
import { Point } from './model/geometry'
import { PopulationModel } from './model/population'
import { makePieChart } from './pie-chart/pie-chart'
import { useCurrentChart } from './use-current-chart'

const BRUSH = { alpha: 1, color: 'black', width: 3 } as const
const DENSITY = 0.5 as const
const MAX_COUNT = 100 as const

const DEFAULT_POPULATION: PopulationModel = {
  colors: ['#ff0000', '#ffa500', '#ffee00', '#00ff00', '#1e90ff', '#0000cd', '#9900ff'],
  count:  25,
  eyes:   [1, 2, 3, 4, 5],
  seed:   1812433253 * Math.random(),
  sides:  [3, 4, 5, 6, 7, 8],
}

export function App(): ReactElement {
  const [population, setPopulation] = useState<PopulationModel>(DEFAULT_POPULATION)
  const [showDialog, setShowDialog] = useState(false)

  const { colors, count, seed } = population
  const random = useMemo(() => makeSeededRandom(seed), [seed])

  const size = useWindowSize({ marginBottom: 100 })
  const { width, height } = size

  const bounds = useMemo(() => ({ left: 30, top: 30, right: width - 60, bottom: height - 60 }), [width, height])
  const makeCreatures = useMemo(() => makeCreatureFactory(MAX_COUNT), [])

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)
  const [target, setTarget] = useState<Creature | null>(null)
  const [state, dispatchAppState] = useAppState()


  const radius = useRadius({ count, density: DENSITY, size })
  const creatures = useMemo(() => makeCreatures({ brush: BRUSH, population, radius, size }), [colors, count])
  const pushApart = useMemo(() => makePushApart(creatures), [])
  const barChart = useMemo(() => makeBarChart({ bounds, creatures, radius, random }), [bounds, creatures])
  const pieChart = useMemo(() => makePieChart({ count, creatures, radius, random, size }), [creatures, radius, size])

  const [pointer, setPointer] = useState<Point | null>(null)

  const chart = useCurrentChart({ type: state.chart, barChart, pieChart })
  useCreaturesDrag({ chart, creatures, enabled: !showDialog, setPointer, setTarget })

  const tick = useCallback((deltaTime: number) => {
    dispatchAppState(iterate(deltaTime))
  }, [dispatchAppState])

  useTick(tick)

  const context = canvas?.getContext('2d')
  if (context) {
    draw({ context, creatures, barChart, pieChart, pushApart, pointer, radius, size, state, target })
  }

  return (
    <Fragment>
      <div className="layer">
        <canvas ref={setCanvas} width={width} height={height} style={{ width, height }}/>
      </div>
      <Ui
        barChart={barChart}
        dispatchAppState={dispatchAppState}
        pieChart={pieChart}
        population={population}
        setPopulation={setPopulation}
        setShowDialog={setShowDialog}
        showDialog={showDialog}
        state={state}
      />
    </Fragment>
  )
}

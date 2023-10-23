import { useMemo } from 'react'
import { lighten } from 'src/lib/color-utils'
import { expoOut, quadInOut } from 'src/lib/ease'
import { clamp } from 'src/lib/math-utils'
import { Creature } from 'src/model/creatures'
import { Brush, DrawingApi } from 'src/model/drawing'
import { Optional } from 'src/types'
import { HANDS, makeDrawHands } from './draw-hands'

interface Props {
  brush:      Brush
  drawingApi: DrawingApi
  duration:   number
}

export interface Waves {
  apply:  (creature: Creature, hands: HANDS, extendsWave?: boolean) => void
  update: (time: number) => void
}

interface WaveConfig {
  color:    string
  alpha:    number
  progress: number
  duration: number
  hands:    HANDS
}

const SCALAR = 5
const ANGLE = Math.PI / 20

export function useWaves(props: Optional<Props>): Waves | undefined {
  const { brush, drawingApi, duration } = props

  return useMemo(() => {
    return brush && drawingApi && duration
      ? makeWaves({ brush, drawingApi, duration })
      : undefined
  }, [brush, drawingApi, duration])
}

export function makeWaves(props: Props): Waves {
  const { brush: coreBrush, drawingApi, duration } = props
  const scaledDuration = duration * SCALAR
  const drawHands = makeDrawHands(drawingApi)

  let current = -1
  const waves = new Map<Creature, WaveConfig>()

  return { apply, update }

  function apply(creature: Creature, hands: HANDS, extendsWave: boolean = false): void {
    const current = waves.get(creature)
    if (current && extendsWave) {
      current.duration += duration
    } else {
      waves.set(creature, makeWaveConfig(creature, hands))
    }

  }
  function makeWaveConfig(creature: Creature, hands: HANDS): WaveConfig {
    const { color: creatureColor } = creature
    const color = lighten(creatureColor)
    return { alpha: 0, color, progress: 0, duration: scaledDuration, hands }
  }

  function update(time: number): void {
    const delta = (current === -1 ? 0 : time - current) * SCALAR
    current = time
    waves.forEach(updateWave)

    function updateWave(wave: WaveConfig, creature: Creature): void {
      const { duration } = wave

      wave.progress += delta
      if (wave.progress > duration) {
        waves.delete(creature)
      } else {
        const deltaAlpha = 0.01 * (duration - wave.progress > 0.5 * SCALAR ? 1 : -1)
        wave.alpha = clamp(wave.alpha + deltaAlpha, 0, 1)
        draw(wave, creature)
      }
    }

    function draw(wave: WaveConfig, creature: Creature): void {
      const { alpha, color, hands, progress } = wave
      const { center, radius: creatureRadius } = creature

      const brush = { ...coreBrush, alpha: (coreBrush.alpha ?? 1) * alpha }
      const fill = { color, alpha: (coreBrush.alpha ?? 1) * alpha }

      const p = progress % 2
      const q = (p + 0.5) % 2
      const rotations: [left: number, right: number] = [getRotation(p), getRotation(q)]
      const radius = expoOut(alpha) * creatureRadius
      drawHands({ brush, fill, position: center, radius, rotations, hands })
    }

    function getRotation(n: number): number {
      return (1 - quadInOut(n > 1 ? 2 - n : n)) * ANGLE
    }
  }


}

import { Creature } from 'src/model/creatures'
import { Size } from 'src/model/values'
import { clamp } from './math-utils'

interface Props {
  creatures: Creature[]
  radius:    number
  scale?:    number
  size:      Size
}

export function clampCreatures(props: Props): void {
  const { creatures, radius, scale = 1, size } = props
  const { width, height } = size

  const min = radius * scale
  const right = width - min
  const bottom = height - min

  creatures.forEach(clampCreature)

  function clampCreature(creature: Creature): void {
    const { center } = creature
    center.x = clamp(center.x, min, right)
    center.y = clamp(center.y, min, bottom)
  }
}

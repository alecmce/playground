import { hsl, scale } from 'chroma-js'
import { makeSeededRandom } from './seeded-random'

interface Props {
  count:  number
}

const SATURATION = 0.6
const LIGHTNESS = 0.6

export function makeColorScale(props: Props): string[] {
  const { count } = props

  const random = makeSeededRandom()

  const start = random.int(0, 360)
  const colors = [hsl(start, SATURATION, LIGHTNESS), hsl(start + 90, SATURATION, LIGHTNESS)]
  return scale(colors).mode('hsl').colors(count)
}

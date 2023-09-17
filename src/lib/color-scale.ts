import { hsl, scale } from 'chroma-js'
import { SeededRandom } from 'src/model/random'

interface Props {
  count:  number
  random: SeededRandom
}

const SATURATION = 0.6
const LIGHTNESS = 0.6

export function makeColorScale(props: Props): string[] {
  const { count, random } = props

  const start = random.int(0, 360)
  const colors = [hsl(start, SATURATION, LIGHTNESS), hsl(start + 90, SATURATION, LIGHTNESS)]
  return scale(colors).mode('hsl').colors(count)
}

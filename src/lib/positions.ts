import { Point, Rectangle } from 'src/model/geometry'
import { makeSeededRandom } from './seeded-random'


interface Props {
  bounds:   Rectangle
  count:    number
  maxCount: number
  radius:   number
  seed:     number
}


export interface MakePositions {
  (props: Props): Point[]
}

export function makePositionFactory(): MakePositions {
  const cacheSeed = -1
  let cache: Point[] = []

  return function makePositions(props: Props): Point[] {
    const { bounds, count, maxCount, radius, seed } = props
    const { bottom, left, right, top } = bounds

    if (cacheSeed !== seed) {
      cache = makeRandomPoints(seed, maxCount)
    }

    return cache.slice(0, count).map(configurePosition)

    function configurePosition(point: Point): Point {
      const x = left + point.x * ((right - left) - 2 * radius) + radius
      const y = top + point.y * ((bottom - top) - 2 * radius) + radius
      return { x, y }
    }
  }
}

function makeRandomPoints(seed: number, count: number): Point[] {
  const random =  makeSeededRandom(seed)

  return Array.from({ length: count }, makeInitialPoint)

  function makeInitialPoint(): Point {
    const x = random.float(0, 1)
    const y = random.float(0, 1)
    return { x, y }
  }
}

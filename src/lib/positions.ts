import { Point } from 'src/model/geometry'
import { Size } from 'src/model/values'
import { makeSeededRandom } from './seeded-random'


interface Props {
  count:    number
  maxCount: number
  radius:   number
  seed:     number
  size:     Size
}


export interface MakePositions {
  (props: Props): Point[]
}

export function makePositionFactory(): MakePositions {
  const cacheSeed = -1
  let cache: Point[] = []

  return function makePositions(props: Props): Point[] {
    const { count, maxCount, radius, seed, size } = props
    const { height, width } = size

    if (cacheSeed !== seed) {
      cache = makeRandomPoints(seed, maxCount)
    }

    return cache.slice(0, count).map(configurePosition)

    function configurePosition(point: Point): Point {
      const x = point.x * (width - 2 * radius) + radius
      const y = point.y * (height - 2 * radius) + radius
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

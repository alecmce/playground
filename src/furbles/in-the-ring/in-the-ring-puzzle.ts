import { mix } from 'chroma-js'
import { splitArray } from 'src/lib/array-util'
import { getDistance } from 'src/lib/math-utils'
import { getRandomSeed, makeSeededRandom } from 'src/lib/seeded-random'
import { AppStateAction, setMetadata } from 'src/model/app-state'
import { CATEGORY, Creature, MakeCreatures, SetInclusionState } from 'src/model/creatures'
import { Brush, DrawFurblesProps, DrawingApi } from 'src/model/drawing'
import { Point, Rectangle } from 'src/model/geometry'
import { Puzzle } from 'src/model/puzzle'
import { prune } from 'src/util/object-util'
import { COLORS as COLOR_VALUES, EYES as EYES_VALUES, SIDES as SIDES_VALUES } from '../constants'
import { makeInTheRingConfig } from './in-the-ring-config'
import { makeWalks } from './walks'

interface Props {
  bounds:           Rectangle
  complexity:       1 | 2 | 3
  dispatchAppState: (action: AppStateAction) => void
  drawingApi:       DrawingApi
  makeCreatures:    MakeCreatures
  seed?:            number
}

const { COLOR, EYES, SIDES } = CATEGORY

export function makeInTheRingPuzzle(props: Props): Puzzle {
  const { bounds, complexity, dispatchAppState, drawingApi, makeCreatures, seed = getRandomSeed()} = props

  const name = `In The Ring • Level ${complexity}`
  const random = makeSeededRandom(seed)

  const primary = random.from([COLOR, COLOR, COLOR, SIDES, SIDES, EYES])
  const secondary = random.from([COLOR, SIDES, EYES].filter(c => c !== primary))

  const colors = getValues(COLOR_VALUES.map(c => c.value), COLOR)
  const eyes = getValues(EYES_VALUES.map(e => e.value), EYES)
  const sides = getValues(SIDES_VALUES.map(s => s.value), SIDES)
  const count = getCount()

  let successFlash = 0
  const walks = makeWalks()

  const creatures = makeCreatures({ colors, count, eyes, seed, sides })
  const inRing = new Set<Creature>()

  const inGroup = prune({
    [COLOR]: isUsed(COLOR) ? colors[0] : undefined,
    [EYES]:  isUsed(EYES)  ? eyes[0]   : undefined,
    [SIDES]: isUsed(SIDES) ? sides[0]  : undefined,
  })

  const joinGroup = prune({
    [COLOR]: colors,
    [EYES]: eyes,
    [SIDES]: sides,
  })

  const inGroupCreatures = getInGroupCreatures(inGroup, creatures)
  updateMetadata()

  const puzzle: Puzzle = { creatures, drawEnter, drawMain, drawExit, name, seed, onDrop }
  const config = makeInTheRingConfig({ bounds, creatures, inGroup, inGroupCreatures, joinGroup })
  return puzzle


  function getValues(values: string[], target: CATEGORY): string[] {
    return random.list(values, getColorCount())

    function getColorCount(): number {
      switch (complexity) {
        case 1: return isUsed(target) ? 3 : 1
        case 2: return isUsed(target) ? 3 : 2
        case 3: return 3
      }
    }
  }

  function isUsed(category: CATEGORY): boolean {
    return category === primary || (category === secondary && complexity > 1)
  }

  function getCount(): number {
    switch (complexity) {
      case 1: return 6
      case 2: return 12
      case 3: return 18
    }
  }

  function drawEnter(props: DrawFurblesProps, proportion: number): void {
    const { brush, pointer } = props
    const { drawCircle } = drawingApi

    const alpha = proportion
    drawCircle({ brush: { ...brush, alpha }, circle: config.circle })
    creatures.forEach(creature => creature.draw({ alpha, pointer, scale: 1, target: null }))
  }

  function drawMain(props: DrawFurblesProps): void {
    const { brush, pointer } = props
    const { drawCircle } = drawingApi

    walks.update()

    if (successFlash > 0) {
      successFlash -= 0.008
      drawCircle({ brush: getFlashBrush(brush, successFlash), circle: config.circle })
    } else {
      successFlash = 0.000
      drawCircle({ brush, circle: config.circle })
    }
    creatures.forEach(creature => creature.draw({ pointer, scale: 1, target: null }))
  }

  function getFlashBrush(brush: Brush, successFlash: number): Brush {
    const { width, color } = brush
    return {
      ...brush,
      width: width * (1 + successFlash * 3),
      color: mix(color as string, 'lime', successFlash * 2).hex(),
    }
  }

  function drawExit(props: DrawFurblesProps, proportion: number): void {
    const { brush, pointer } = props
    const { drawCircle } = drawingApi

    const alpha = 1 - proportion
    drawCircle({ brush: { ...brush, alpha }, circle: config.circle })
    creatures.forEach(creature => creature.draw({ alpha, pointer, scale: 1, target: null }))
  }

  function onDrop(_: Point, current: Point, creature: Creature): void {
    isDroppedInCircle()
      ? inRing.add(creature)
      : inRing.delete(creature)

    updateMetadata()

    function isDroppedInCircle(): boolean {
      const { circle: { center, radius } } = config
      return getDistance(center, current) < radius
    }

    // function acceptCreature(creature: Creature): void {
    //   successFlash = 1.0
    //   inRing.add(creature)
    // }

    // function rejectCreature(): void {
    //   walks.add(creature, down)
    // }
  }

  function updateMetadata(): void {
    const [right, wrong] = splitArray(creatures, isInRightPlace)
    dispatchAppState(setMetadata({ right, wrong }))

    function isInRightPlace(creature: Creature): boolean {
      return inRing.has(creature) == isInGroup(creature)
    }
  }

  function isInGroup(creature: Creature): boolean {
    return inGroupCreatures.includes(creature)
  }
}

function getInGroupCreatures(inGroup: SetInclusionState, creatures: Creature[]): Creature[] {
  return creatures.filter(isInGroup)

  function isInGroup(creature: Creature): boolean {
    const { color, eyes, sides } = creature
    const { [COLOR]: groupColor, [EYES]: groupEyes, [SIDES]: groupSides } = inGroup

    return (
      (!groupColor || color === groupColor) &&
      (!groupEyes || eyes === groupEyes) &&
      (!groupSides || sides === groupSides)
    )
  }
}

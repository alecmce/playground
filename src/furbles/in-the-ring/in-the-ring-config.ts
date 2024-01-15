import { assignOptions } from 'src/lib/assign-options'
import { makeFibonacciCircles } from 'src/lib/fibonacci-circles'
import { makeRectangleCircles } from 'src/lib/rectangle-circles'
import { makeRegularPolygon } from 'src/lib/regular-polygon'
import { Assignment } from 'src/model/charts'
import { Creature, SetInclusionState, SetInclusionValues } from 'src/model/creatures'
import { Circle, Point, Polygon, Rectangle } from 'src/model/geometry'
import { makePlaceAssignmentOptions } from 'src/util/make-place-assignment-options'

interface Props {
  bounds:           Rectangle
  creatures:        Creature[]
  inGroup:          SetInclusionState
  inGroupCreatures: Creature[]
  joinGroup:        SetInclusionValues
}

export interface InTheRingConfig {
  creatures:       Creature[]
  assignments:     Assignment<Point, unknown>[]
  circle:          Circle
  solution:        DiagramIcon
  radius:          number
}

interface DiagramIcon {
  center:       Point
  color?:       string
  eyes?:        string
  radius:       number
  sides?:       Polygon | null
}

const DEG_45 = Math.PI / 4

export function makeInTheRingConfig(props: Props): InTheRingConfig {
  const { bounds, creatures, inGroup, joinGroup, inGroupCreatures } = props

  const boundsWidth = Math.abs(bounds.right - bounds.left)
  const boundsHeight = Math.abs(bounds.bottom - bounds.top)

  const center = { x: bounds.left + 3 * boundsWidth / 4, y: bounds.top + boundsHeight / 2 }
  const circleRadius = boundsWidth / 4
  const circle = { center, radius: circleRadius }

  const inGroupCircles = makeFibonacciCircles({ center, count: inGroupCreatures.length, radius: circleRadius })
  const outGroupBounds = { ...bounds, right: bounds.left + boundsWidth / 2 }
  const outGroupCircles = makeRectangleCircles({ count: creatures.length, rectangle: outGroupBounds })
  const radius = Math.min(getRadius(inGroupCircles), getRadius(outGroupCircles))

  const assignments = assignOptions(getOptions())
  assignments.forEach(setAssignment)

  const solution = getIcon()

  return { creatures, assignments, circle, solution, radius }

  function getOptions(): Assignment<Point, unknown>[] {
    const places = outGroupCircles.map(toPoint)
    return makePlaceAssignmentOptions({ categories: joinGroup, creatures, places })
  }

  function getIcon(): DiagramIcon {
    const { x, y } = center
    const dx = (circleRadius + radius) * Math.cos(DEG_45)
    const dy = (circleRadius + radius) * Math.sin(DEG_45)
    const rotation = Math.random() * Math.PI * 2
    const sides = inGroup.sides ? makeRegularPolygon({ radius, rotation, sides: parseInt(inGroup.sides) }) : null

    return { ...inGroup, center: { x: x + dx, y: y + dy }, radius, sides }
  }
}

function setAssignment(assignment: Assignment<Point, unknown>): void {
  const { creature, place } = assignment
  creature.center.x = place.x
  creature.center.y = place.y
}

function toPoint(circle: Circle): Point {
  return circle.center
}

function getRadius(circles: Circle[]): number {
  return circles[0].radius
}

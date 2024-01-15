import { Creature } from './creatures'
import { DrawFurblesProps } from './drawing'
import { Point } from './geometry'

export interface Puzzle {
  creatures:  Creature[]
  name:       string
  seed:       number
  drawEnter:  (props: DrawFurblesProps, p: number) => void
  drawMain:   (props: DrawFurblesProps) => void
  drawExit:   (props: DrawFurblesProps, p: number) => void
  onDrop:     (down: Point, current: Point, creature: Creature) => void
}

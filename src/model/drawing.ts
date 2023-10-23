import { ApplyBrush } from 'src/draw/apply-brush'
import { ApplyFill } from 'src/draw/apply-fill'
import { DrawRectangle } from 'src/draw/draw-rectangle'
import { Circle, Point, Polygon } from './geometry'
import { Size } from './values'

export interface Brush {
  alpha?:  number
  cap?:    CanvasLineCap
  color:   string | CanvasGradient | CanvasPattern
  dashes?: BrushDashes
  join?:   CanvasLineJoin
  width:   number
}

interface BrushDashes {
  offset:   number
  segments: number[]
}

export interface Fill {
  alpha?: number
  color:  string | string[]
}

export interface DrawingPrerequisites {
  brush:      Brush | null
  applyBrush: ApplyBrush
  applyFill:  ApplyFill
  context:    CanvasRenderingContext2D
}

export interface DrawingApi {
  applyBrush:       ApplyBrush
  applyFill:        ApplyFill
  clear:            ClearDrawing
  context:          CanvasRenderingContext2D
  drawCircle:       DrawCircle
  drawCircleSector: DrawCircleSector
  drawEyes:         DrawEyes
  drawIcon:         DrawIcon
  drawPath:         DrawPath
  drawPolygon:      DrawPolygon
  drawRectangle:    DrawRectangle
}

export interface ClearDrawing {
  (size: Size): void
}

export interface DrawCircleProps {
  brush?: Brush
  circle: Circle
  fill?:  Fill
}

export interface DrawCircle {
  (props: DrawCircleProps): void
}

export interface DrawCircleSectorProps {
  angle:  number
  brush?: Brush
  circle: Circle
  fill?:  Fill
  inner?: number
  theta:  number
}

export interface DrawCircleSector {
  (props: DrawCircleSectorProps): void
}

export interface DrawEyesProps {
  brush?:  Brush
  center:  Point
  eyes:    string
  pointer: Point | null
  scale:   number
}

export interface DrawEyes {
  (props: DrawEyesProps): void
}

export interface DrawPolygonProps {
  brush?:  Brush
  center?: Point
  fill?:   Fill
  polygon: Polygon
  scale?:  number
}

export interface DrawPolygon {
  (props: DrawPolygonProps): void
}

export interface DrawPathProps {
  brush?:  Brush
  center?: Point
  fill?:   Fill
  path:    Path2D
}

export interface DrawPath {
  (props: DrawPathProps): void
}

export interface DrawIconProps {
  alpha:     number
  brush?:    Brush
  center:    Point
  eyesScale: number
  pointer:   Point | null
  scale:     number
  color?:    string
  eyes?:     string
  sides?:    Polygon | null
}

export interface DrawIcon {
  (props: DrawIconProps): void
}

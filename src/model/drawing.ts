export interface Drawing {
  brush?:  Brush
  context: CanvasRenderingContext2D
  fill?:   Fill
}

export interface Brush {
  alpha:   number
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
  alpha: number
  color: string
}

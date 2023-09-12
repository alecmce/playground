export type Polygon = Point[]

export interface Circle {
  center: Point
  radius: number
}

export interface Point {
  x: number
  y: number
}

export interface ArcPlace extends Point {
  angle: number
  theta: number
}

export interface Rectangle {
  bottom: number
  left:   number
  right:  number
  top:    number
}

export interface RectanglePlace extends Point, Rectangle {}

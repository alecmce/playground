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

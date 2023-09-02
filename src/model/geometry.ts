export type Polygon = Point[]

export interface Circle {
  center: Point
  radius: number
}

export interface Point {
  x: number
  y: number
}

export interface Positions {
  points:  Point[]
  radius:  number
  version: number
}

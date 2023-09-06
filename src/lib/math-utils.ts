import { Point } from 'src/model/geometry'

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function getDistance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function max(values: number[]): number {
  if (!values || !values.length) {
    return NaN
  }
  return values.reduce((p, n) => p > n ? p : n, -Infinity)
}

export interface SeededRandom {
  seed:    number
  float:   (min: number, max: number) => number
  int:     (min: number, max: number) => number
  list:    <T>(data: T[], count: number) => T[]
  from:    <T>(data: T[]) => T
  shuffle: <T>(data: T[]) => T[]
}

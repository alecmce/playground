import { describe, expect, it } from 'vitest'
import { MersenneTwister } from './mersenne-twister'

describe('MersenneTwister', () => {

  it('produces values in the integer range that include min and max', () => {
    const rnd = new MersenneTwister(12345)
    const values = Array.from({ length: 100 }).map(() => rnd.int(3, 5))
    expect(values.filter(n => n === 3).length).toBeGreaterThan(30)
    expect(values.filter(n => n === 4).length).toBeGreaterThan(30)
    expect(values.filter(n => n === 5).length).toBeGreaterThan(30)
  })

})

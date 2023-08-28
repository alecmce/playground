import { SeededRandom } from 'src/model/random'

/**
 * Uses the source below (from https://gist.github.com/aradzie/c12da8c537e83c0fae52)
 * to generate pseudo-random numbers based on a seed.
 */
export function makeTwister(seed: number): SeededRandom {
  const twister = mersenneTwister(seed)

  return { float, int, list, from, shuffle }

  function float(min: number, max: number): number {
    return min + twister.real2() * (max - min)
  }

  function int(min: number, max: number): number {
    return min + Math.floor(twister.real2() * (max + 1 - min))
  }

  function list<T>(data: T[], count: number): T[] {
    const indices = Array.from({ length: data.length }, (_, i) => i)
    const output: T[] = []
    for (let i = 0; i < count; i++) {
      const n = int(0, indices.length - 1)
      const index = indices.splice(n, 1)[0]
      output.push(data[index])
    }
    return output
  }

  function from<T>(data: T[]): T {
    return data[int(0, data.length - 1)]
  }

  function shuffle<T>(data: T[]): T[] {
    return list(data, data.length)
  }
}


// Code adapted from http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/MT2002/emt19937ar.html

// Original copyright:
/*
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.

   Before using, initialize the state by using init_genrand(seed)
   or init_by_array(init_key, key_length).

   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote
        products derived from this software without specific prior written
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
*/

interface Twister {
  int32(): number
  real1(): number
  real2(): number
  real3(): number
  res53(): number
}

function mersenneTwister(seed: number): Twister {
  const N = 624
  const M = 397
  const MATRIX_A = 0x9908B0DF
  const UPPER_MASK = 0x80000000
  const LOWER_MASK = 0x7FFFFFFF
  const MAG01 = [0, MATRIX_A]

  const mt = new Uint32Array(N)
  let mti = 0

  mt[0] = seed >>> 0
  for (mti = 1; mti < N; mti++) {
    mt[mti] = (1812433253 * (mt[mti - 1] ^ (mt[mti - 1] >>> 30)) + mti) >>> 0
  }

  /* Generates a random number on [0,0xFFFFFFFF]-interval. */
  function int32() {
    let y

    if (mti >= N) {
      let kk = 0
      for (; kk < N - M; kk++) {
        y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK)
        mt[kk] = mt[kk + M] ^ (y >>> 1) ^ MAG01[y & 1]
      }
      for (; kk < N - 1; kk++) {
        y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK)
        mt[kk] = mt[kk + (M - N)] ^ (y >>> 1) ^ MAG01[y & 1]
      }
      y = (mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK)
      mt[N - 1] = mt[M - 1] ^ (y >>> 1) ^ MAG01[y & 1]
      mti = 0
    }

    y = mt[mti++]

    y ^= (y >>> 11)
    y ^= (y << 7) & 0x9D2C5680
    y ^= (y << 15) & 0xEFC60000
    y ^= (y >>> 18)

    return y >>> 0
  }

  /* Generates a random number on [0,1]-real-interval. */
  function real1() {
    return int32() * (1.0 / 0xFFFFFFFF) // Divided by 2^32-1
  }

  /* Generates a random number on [0,1)-real-interval. */
  function real2() {
    return int32() * (1.0 / 4294967296.0) // Divided by 2^32
  }

  /* Generates a random number on (0,1)-real-interval. */
  function real3() {
    return (int32() + 0.5) * (1.0 / 4294967296.0) // Divided by 2^32
  }

  /* Generates a random number on [0,1) with 53-bit resolution. */
  function res53() {
    const a = int32() >>> 5, b = int32() >>> 6
    return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0)
  }

  return { int32, real1, real2, real3, res53 }
}


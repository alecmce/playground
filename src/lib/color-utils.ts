import { mix } from 'chroma-js'

export function lighten(color: string, factor = 0.3): string {
  return mix(color, 'white', factor).hex()
}

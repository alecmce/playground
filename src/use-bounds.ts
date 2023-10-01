import { useMemo } from 'react'
import { Rectangle } from './model/geometry'
import { Size } from './model/values'

const PADDING = 30
const UI_HEIGHT = 64

export function useBounds(size: Size): Rectangle {
  const { width, height } = size

  return useMemo(() => ({
    bottom: height - 2 * PADDING - UI_HEIGHT,
    left: PADDING,
    right: width - 2 * PADDING,
    top: PADDING,
  }), [width, height])
}

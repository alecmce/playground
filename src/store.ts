import { create } from 'zustand'
import { Point } from './model/geometry'
import { Shape } from './model/shapes'

interface ShapeStore {
  centers:    Point[]
  setCenters: (centers: Point[]) => void
  setShapes:  (shapes: Shape[]) => void
  shapes:     Shape[]
}

export const useShapes = create<ShapeStore>((set) => {
  return {
    centers: [],
    setCenters,
    setShapes,
    shapes: [],
  }

  function setShapes(shapes: Shape[]): void {
    set((state: ShapeStore) => ({ ...state, shapes }))
  }

  function setCenters(centers: Point[]): void {
    set((state: ShapeStore) => ({ ...state, centers }))
  }
})

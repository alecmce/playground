import { useEffect, useRef } from 'react'

export function useTick(tick: VoidFunction): void {
  const ref = useRef<VoidFunction>(() => void 0)
  ref.current = tick

  useEffect(() => {
    iterate()

    function iterate(): void {
      tick()
      requestAnimationFrame(iterate)
    }
  }, [tick])
}

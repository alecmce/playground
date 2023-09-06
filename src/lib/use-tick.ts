import { useEffect, useRef } from 'react'

interface Tick {
  (deltaTime: number): void
}

export function useTick(tick: Tick): void {
  const time = useRef<number>(performance.now())
  const ref = useRef<Tick>(() => void 0)
  ref.current = tick

  useEffect(() => {

    iterate()

    function iterate(): void {
      const now = performance.now()
      const deltaTime = now - time.current
      time.current = now
      tick(deltaTime)
      requestAnimationFrame(iterate)
    }
  }, [tick])
}

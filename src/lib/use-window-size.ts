import { useEffect, useState } from 'react'
import { Size } from 'src/model/values'

interface Props {
  marginBottom?: number
}

export function useWindowSize(props: Props = {}): Size {
  const { marginBottom = 0 } = props
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight - marginBottom })

  useEffect(() => {
    window.addEventListener('resize', onResize)

    function onResize(): void {
      setSize({ width: window.innerWidth, height: window.innerHeight - marginBottom })
    }

    return function dispose(): void {
      window.removeEventListener('resize', onResize)
    }
  })

  return size
}

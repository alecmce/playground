import { ReactElement } from 'react'


interface Props {
  width:  number
  height: number
}

export function EnglandFlag(props: Props): ReactElement {
  const { width, height } = props
  const ratio = width / height
  const scale = (800 / 480) / ratio

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width * scale} height={height * scale} viewBox="0 0 800 480">
      <path fill="#FFF" d="m0,0h800v480H0"/>
      <path stroke="#C8102E" strokeWidth="96" d="m0,240h800M400,0v480"/>
    </svg>
  )
}

export function ScotlandFlag(props: Props): ReactElement {
  const { width, height } = props
  const ratio = width / height
  const scale = (1000 / 600) / ratio

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width * scale} height={height * scale} viewBox="0 0 1000 600">
      <rect width="100%" height="100%" fill="#005EB8"/>
      <path stroke="#fff" strokeWidth="120" d="m0 0 1000 600M0 600 1000 0"/>
    </svg>
  )
}

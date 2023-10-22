import BarChart from '@mui/icons-material/BarChart'
import ColorLens from '@mui/icons-material/ColorLens'
import GridView from '@mui/icons-material/GridView'
import Groups3 from '@mui/icons-material/Groups3'
import Home from '@mui/icons-material/Home'
import JoinInner from '@mui/icons-material/JoinInner'
import JoinLeft from '@mui/icons-material/JoinLeft'
import JoinRight from '@mui/icons-material/JoinRight'
import Pentagon from '@mui/icons-material/Pentagon'
import PieChart from '@mui/icons-material/PieChart'
import Visibility from '@mui/icons-material/Visibility'
import { createSvgIcon } from '@mui/material'
import { ReactElement } from 'react'

interface Props {
  color?: 'inherit' | 'action' | 'disabled' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
}

export function HomeIcon(props: Props): ReactElement {
  return <Home {...props} />
}

export function PopulationIcon(props: Props): ReactElement {
  return <Groups3 {...props} />
}

export function BarChartIcon(props: Props): ReactElement {
  return <BarChart {...props} />
}

export function PieChartIcon(props: Props): ReactElement {
  return <PieChart {...props} />
}

export function CarrollDiagramIcon(props: Props): ReactElement {
  return <GridView {...props} />
}

export function CarrollDiagramFirstIcon(props: Props): ReactElement {
  return <CarrollDiagramFirst {...props} />
}

const CarrollDiagramFirst = createSvgIcon((
  <path
    d="M 3 3 v 8 h 8 V 3 H 3 z M 3 13 v 8 h 8 v -8 H 3 z M 9 19 H 5 v -4 h 4 v 4 z M 13 3 v 8 h 8 V 3 h -8 z M 13 13 v 8 h 8 v -8 h -8 z M 19 19 h -4 v -4 h 4 v 4 z"
    fillRule="evenodd"
  />
), 'CarrollDiagramFirst')

export function CarollDiagramSecondIcon(props: Props): ReactElement {
  return <CarollDiagramSecond {...props} />
}

const CarollDiagramSecond = createSvgIcon((
  <path
    d="M 3 3 v 8 h 8 V 3 H 3 z M 3 13 v 8 h 8 v -8 H 3 z M 13 3 v 8 h 8 V 3 h -8 z M 19 9 h -4 V 5 h 4 v 4 z M 13 13 v 8 h 8 v -8 h -8 z M 19 19 h -4 v -4 h 4 v 4 z"
    fillRule="evenodd"
  />
), 'CarollDiagramSecond')


export function VennDiagramIcon(props: Props): ReactElement {
  return <JoinInner {...props} />
}

export function VennDiagramLeftIcon(props: Props): ReactElement {
  return <JoinLeft {...props} />
}

export function VennDiagramRightIcon(props: Props): ReactElement {
  return <JoinRight {...props} />
}

export function ColorsIcon(props: Props): ReactElement {
  return <ColorLens {...props} />
}

export function EyesIcon(props: Props): ReactElement {
  return <Visibility {...props} />
}

export function SidesIcon(props: Props): ReactElement {
  return <Pentagon {...props} />
}

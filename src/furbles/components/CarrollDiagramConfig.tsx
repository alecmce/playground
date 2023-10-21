import { ReactElement } from 'react'
import { AppStateAction, CHART_TYPE } from 'src/model/app-state'
import { SetInclusionChart } from 'src/model/charts'
import { CarollDiagramSecondIcon, CarrollDiagramFirstIcon } from './Icons'
import { SetInclusionDiagramConfig } from './SetInclusionConfig'


export interface props {
  diagram:          SetInclusionChart
  dispatchAppState: (action: AppStateAction) => void
}

export function CarrollDiagramConfig(props: props): ReactElement {
  return (
    <SetInclusionDiagramConfig
      {...props}
      name="Carroll"
      FirstIcon={<CarrollDiagramFirstIcon color="warning" />}
      SecondIcon={<CarollDiagramSecondIcon color="warning" />}
      chartType={CHART_TYPE.CARROLL_DIAGRAM}
    />
  )
}

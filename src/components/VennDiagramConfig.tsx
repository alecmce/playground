import { ReactElement } from 'react'
import { AppStateAction, CHART_TYPE } from 'src/model/app-state'
import { SetInclusionChart } from 'src/model/charts'
import { VennDiagramLeftIcon, VennDiagramRightIcon } from './Icons'
import { SetInclusionDiagramConfig } from './SetInclusionConfig'

export interface Props {
  diagram:          SetInclusionChart
  dispatchAppState: (action: AppStateAction) => void
}

export function VennDiagramConfig(props: Props): ReactElement {
  return (
    <SetInclusionDiagramConfig
      {...props}
      name="Venn"
      chartType={CHART_TYPE.VENN_DIAGRAM}
      FirstIcon={<VennDiagramLeftIcon color="warning" />}
      SecondIcon={<VennDiagramRightIcon color="warning" />}
    />
  )
}

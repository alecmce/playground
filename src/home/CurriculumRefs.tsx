import { Stack, Typography } from '@mui/joy'
import { ReactElement } from 'react'
import { EnglandFlag, ScotlandFlag } from 'src/lib/flags'


const SCOTTISH_CURRICULUM_LINK = 'https://education.gov.scot/Documents/numeracy-maths-eo.pdf'
const ENGLISH_CURRICULUM_LINK = 'https://assets.publishing.service.gov.uk/media/5a7da548ed915d2ac884cb07/PRIMARY_national_curriculum_-_Mathematics_220714.pdf'

interface Props {
  scottishRef: string
  englishRef:  string
}

export function CurriculumRefs(props: Props): ReactElement {
  const { scottishRef, englishRef } = props
  return (
    <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{marginBottom: 2}}>
      <Stack direction="row" spacing={0.5}>
        <ScotlandFlag width={20} height={15} />
        <Typography level="body-xs"><a href={SCOTTISH_CURRICULUM_LINK}>{scottishRef}</a></Typography>
      </Stack>
      <Stack direction="row" spacing={0.5}>
        <EnglandFlag width={20} height={15} />
        <Typography level="body-xs"><a href={ENGLISH_CURRICULUM_LINK}>{englishRef}</a></Typography>
      </Stack>
    </Stack>
  )
}

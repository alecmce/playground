import { CSSObject } from '@emotion/react'
import { Button, Card, CardActions, CardContent, Theme, Typography } from '@mui/joy'
import { ReactElement } from 'react'
import { CurriculumRefs } from './CurriculumRefs'


interface Props {
  description: string
  englishRef:  string
  link:        string
  name:        string
  scottishRef: string
  tags:        string
}

export function AppCard(props: Props): ReactElement {
  const { description, englishRef, link, name, scottishRef, tags } = props
  return (
    <Card size="sm" variant="soft" sx={{width: 300, height: '100%'}}>
      <CardContent>
        <Typography level="h2">{ name }</Typography>
        <Typography level="body-md">
          { description }
        </Typography>
        <Typography level="body-sm" color="neutral" gutterBottom>
          { tags }
        </Typography>
        <CurriculumRefs scottishRef={scottishRef} englishRef={englishRef} />
      </CardContent>
      <CardActions>
        <Button component="a" href={link} sx={sx}>Open</Button>
      </CardActions>
    </Card>
  )
}

function sx(theme: Theme): CSSObject {
  return { '&:hover': { color: theme.palette.primary.solidColor } }
}

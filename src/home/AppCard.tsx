import { CSSObject } from '@emotion/react'
import { Button, Card, CardActions, CardContent, Stack, Theme, Typography } from '@mui/joy'
import { ReactElement } from 'react'


interface Props {
  description: string
  link:        string
  name:        string
  tags:        string
}

export function AppCard(props: Props): ReactElement {
  const { description, link, name, tags } = props
  return (
    <Card size="sm" variant="soft" sx={{width: 300}}>
      <CardContent>
        <Stack direction="column">
          <Typography level="h2">{ name }</Typography>
          <Typography level="body-md">
            { description }
          </Typography>
          <Typography level="body-sm" color="primary" gutterBottom>
            { tags }
          </Typography>
        </Stack>
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

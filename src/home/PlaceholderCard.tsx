import HourglassTop from '@mui/icons-material/HourglassTop'
import { Card, CardContent, Stack, Typography } from '@mui/joy'
import { ReactElement } from 'react'

interface Props {
  name:        string
  description: string
  tags:        string
}

export function PlaceholderCard(props: Props): ReactElement {
  const { name, description, tags } = props
  return (
    <Card size="sm" variant="soft" sx={{width: 300, height: '100%' }}>
      <CardContent>
        <Stack direction="column" sx={{height: '100%'}}>
          <Typography level="h2">{ name }</Typography>
          <Typography level="body-md">
            { description }
          </Typography>
          <Typography level="body-sm" color="primary" gutterBottom>
            { tags }
          </Typography>
        </Stack>
        <Stack alignItems="center" justifyContent="center" sx={{height: '100%'}}>
          <HourglassTop sx={{ width: 100, height: 100}} />
        </Stack>
      </CardContent>
    </Card>
  )
}

// function sx(theme: Theme): CSSObject {
//   return {
//     width: '100px',
//     height: '100px',
//     color: theme.palette.primary.solidColor,
//   }
// }

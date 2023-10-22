import { Grid, Sheet, Stack, Typography } from '@mui/joy'
import { ReactElement } from 'react'
import { AppCard } from './AppCard'
import { Footer } from './Footer'
import { PlaceholderCard } from './PlaceholderCard'


export function Home(): ReactElement {
  return (
    <Sheet sx={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Stack spacing={2} direction="column" alignItems="center">
        <Typography level="h1" fontSize="5rem" color="primary">Playground</Typography>
        <Grid container spacing={2}>
          <Grid>
            <AppCard
              name="Furbles"
              description="Explores the relationship between categorical data and its visualisations."
              tags="Statistics, Data, Pie Charts, Carroll Diagrams, Venn Diagrams"
              scottishRef="MNU 1..4-20a"
              englishRef="Statistics"
              link="/furbles"
            />
          </Grid>
          <Grid>
            <PlaceholderCard
              name="Primitives"
              description="Explores the structure of numbers as a combination of prime factors."
              tags="Number, Factors, Primes, Multiples"
            />
          </Grid>
          <Grid>
            <PlaceholderCard
              name="Soroban"
              description="Explores place value using the Soroban Abacus."
              tags="Numeracy, Number, Place Value, Arithmetic"
            />
          </Grid>
        </Grid>
      </Stack>
      <Footer size={40} />
    </Sheet>
  )
}

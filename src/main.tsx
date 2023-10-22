import { CssVarsProvider, extendTheme } from '@mui/joy'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Furbles } from './furbles/Furbles.tsx'
import { Home } from './home/Home.tsx'
import './index.css'

const router = createBrowserRouter([
  { element: <Home />, path: '/' },
  { element: <Furbles />, path: '/furbles' },
])

const THEME = extendTheme({
  fontFamily: {
    display:  '\'Luckiest Guy\', var(--joy-fontFamily-fallback)', // h1..h4
    body:     '\'Gabarito\', var(--joy-fontFamily-fallback)',
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CssVarsProvider theme={THEME}>
      <RouterProvider router={router} />
    </CssVarsProvider>
  </React.StrictMode>,
)

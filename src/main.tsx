import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Furbles } from './furbles/Furbles.tsx'
import './index.css'

const router = createBrowserRouter([
  { element: <Furbles />, path: '/' },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

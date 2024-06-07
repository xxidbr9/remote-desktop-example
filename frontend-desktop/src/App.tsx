import React from 'react'
import { router } from './routes'
import { RouterProvider } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import './App.css';

type Props = {}


const App = (props: Props) => {
  return (
    <React.Fragment>
       <RouterProvider router={router} />
       <TanStackRouterDevtools router={router} />
    </React.Fragment>
  )
}

export default App;
import './assets/css/globals.css';
import React from 'react'
import { router } from './routes'
import { RouterProvider } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import ThemeProvider from './hooks/theme-provider';
import { TooltipProvider } from './components/ui';
type Props = {}


const App = (props: Props) => {
  return (
    <React.Fragment>
      <ThemeProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
          {/* <TanStackRouterDevtools router={router} /> */}
        </TooltipProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

export default App;
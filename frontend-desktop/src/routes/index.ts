import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { HomeLayout } from '../layouts'
const rootRoute = createRootRoute()

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeLayout
});

const remoteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/remote/$id',
});


const routeTree = rootRoute.addChildren([
  indexRoute,
  remoteRoute,
])


export const router = createRouter({ routeTree })

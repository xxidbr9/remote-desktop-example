import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { HomeLayout, RemoteLayout } from '../layouts'
const rootRoute = createRootRoute()

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomeLayout
});

const remoteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/remote/$id',
  component: RemoteLayout
});


const routeTree = rootRoute.addChildren([
  indexRoute,
  remoteRoute,
])


export const router = createRouter({ routeTree })

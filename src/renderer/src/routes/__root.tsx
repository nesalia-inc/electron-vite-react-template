import { createRootRoute, Outlet } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

export const rootRoute = createRootRoute({
  component: () => <Outlet />,
  loader: ({ context }) => {
    // Ensure queryClient is available
    return context.queryClient
  }
})

declare module '@tanstack/react-router' {
  interface RootRouteContext {
    queryClient: QueryClient
  }
}

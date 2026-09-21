/* eslint-disable react-refresh/only-export-components -- 라우트 lazy import 전용 파일 */
import { Suspense, lazy } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { RequireAuth } from '@/components/common/RequireAuth'

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const CustomerListPage = lazy(() =>
  import('@/features/customers/pages/CustomerListPage').then((m) => ({
    default: m.CustomerListPage,
  })),
)
const CustomerDetailPage = lazy(() =>
  import('@/features/customers/pages/CustomerDetailPage').then((m) => ({
    default: m.CustomerDetailPage,
  })),
)
const OrderListPage = lazy(() =>
  import('@/features/orders/pages/OrderListPage').then((m) => ({
    default: m.OrderListPage,
  })),
)
const OrderDetailPage = lazy(() =>
  import('@/features/orders/pages/OrderDetailPage').then((m) => ({
    default: m.OrderDetailPage,
  })),
)
const DeliveryTrackingPage = lazy(() =>
  import('@/features/delivery/pages/DeliveryTrackingPage').then((m) => ({
    default: m.DeliveryTrackingPage,
  })),
)

function PageFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress />
    </Box>
  )
}

function withSuspense(element: React.ReactNode) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  { path: '/login', element: withSuspense(<LoginPage />) },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to="/customers" replace /> },
          { path: '/customers', element: withSuspense(<CustomerListPage />) },
          { path: '/customers/:customerId', element: withSuspense(<CustomerDetailPage />) },
          { path: '/orders', element: withSuspense(<OrderListPage />) },
          { path: '/orders/:orderId', element: withSuspense(<OrderDetailPage />) },
          {
            path: '/orders/:orderId/delivery',
            element: withSuspense(<DeliveryTrackingPage />),
          },
        ],
      },
    ],
  },
])

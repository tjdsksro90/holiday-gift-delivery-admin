import { Box, CircularProgress } from '@mui/material'
import { Navigate, Outlet } from 'react-router-dom'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'

/**
 * 서버 세션(/auth/me)을 매 진입마다 확인한다.
 * 프론트 state만으로 인증 여부를 판단하지 않는다.
 */
export function RequireAuth() {
  const { data: user, isLoading, isError } = useCurrentUser()

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }
  if (isError || !user) {
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}

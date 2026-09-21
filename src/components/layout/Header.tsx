import LogoutIcon from '@mui/icons-material/Logout'
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/features/auth/api'
import { useAuthStore } from '@/store/authStore'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const clear = useAuthStore((state) => state.clear)
  const navigate = useNavigate()

  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clear()
      navigate('/login', { replace: true })
    },
  })

  return (
    <AppBar position="fixed" color="default" elevation={1} sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          명절세트 배송관리
        </Typography>
        {user && (
          <>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user.displayName}
            </Typography>
            <IconButton onClick={() => mutate()} size="small">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

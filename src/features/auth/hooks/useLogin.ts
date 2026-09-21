import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { login } from '../api'

export function useLogin() {
  const setUser = useAuthStore((state) => state.setUser)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user)
      queryClient.setQueryData(['auth', 'me'], user)
      navigate('/', { replace: true })
    },
  })
}

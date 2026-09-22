import { useState, type FormEvent } from 'react'
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from '@mui/material'
import { MOCKS_ENABLED } from '@/mocks/isEnabled'
import { TEST_ACCOUNT } from '@/mocks/testAccount'
import { useLogin } from '../hooks/useLogin'

export function LoginPage() {
  const [employeeId, setEmployeeId] = useState('')
  const [password, setPassword] = useState('')
  const { mutate, isPending, isError } = useLogin()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    mutate({ employeeId, password })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, width: 360 }}>
        <Stack spacing={2}>
          <Typography variant="h6">명절세트 배송관리 로그인</Typography>
          <TextField
            label="사번"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            autoComplete="username"
            required
          />
          <TextField
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {isError && <Alert severity="error">로그인에 실패했습니다.</Alert>}
          <Button type="submit" variant="contained" disabled={isPending}>
            로그인
          </Button>
          {MOCKS_ENABLED && (
            <Alert severity="info" variant="outlined">
              로컬 목업 테스트 계정 — <br />
              사번: {TEST_ACCOUNT.employeeId} / 비밀번호: {TEST_ACCOUNT.password}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Box>
  )
}

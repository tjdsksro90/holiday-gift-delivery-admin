import { useEffect, useRef, useState } from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import StopIcon from '@mui/icons-material/Stop'
import { Alert, Button, Stack, Typography } from '@mui/material'
import type { Delivery } from '@/types/delivery'
import { useDeliveryStatusActions } from '../hooks/useDeliveryStatusActions'
import { isTerminalDeliveryStatus } from '../statusLabels'

const TICK_MS = 2500

/**
 * 실제 서비스라면 택배사 웹훅이 이 흐름을 자동으로 처리한다.
 * 로컬 목업 환경엔 웹훅이 없으니, 일정 간격으로 advance API를 대신 호출해서
 * "자동으로 상태가 넘어가는" 모습만 개발 중 확인용으로 흉내낸다.
 */
export function DeliveryAutoSimulate({ delivery }: { delivery: Delivery }) {
  const [running, setRunning] = useState(false)
  const isTerminal = isTerminalDeliveryStatus(delivery.status)
  const isActive = running && !isTerminal

  const { advance } = useDeliveryStatusActions(delivery.orderId)
  const advanceRef = useRef(advance.mutate)
  useEffect(() => {
    advanceRef.current = advance.mutate
  })

  useEffect(() => {
    if (!isActive) return
    const id = setInterval(() => advanceRef.current(), TICK_MS)
    return () => clearInterval(id)
  }, [isActive])

  if (!import.meta.env.DEV) return null

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">자동 진행 시뮬레이션 (개발용)</Typography>
      <Alert severity="info" variant="outlined">
        실제 서비스에서는 택배사 웹훅이 이 흐름을 자동으로 처리합니다. 여기서는 그 동작을
        흉내만 냅니다.
      </Alert>
      <Button
        size="small"
        variant="outlined"
        startIcon={isActive ? <StopIcon /> : <PlayArrowIcon />}
        disabled={isTerminal}
        onClick={() => setRunning((r) => !r)}
        sx={{ alignSelf: 'flex-start' }}
      >
        {isActive ? '시뮬레이션 중지' : '자동 진행 시작'}
      </Button>
    </Stack>
  )
}

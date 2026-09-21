import { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { Button, Stack, TextField, Tooltip, Typography } from '@mui/material'
import { useRevealContact } from '@/features/customers/hooks/useRevealContact'

interface RevealContactButtonProps {
  customerId: string
}

/**
 * 클릭 시 사유를 입력받아 서버에 열람을 요청한다.
 * 원본 값은 컴포넌트 로컬 state에만 잠시 보관되고, 언마운트 시 사라진다.
 */
export function RevealContactButton({ customerId }: RevealContactButtonProps) {
  const [reason, setReason] = useState('')
  const [open, setOpen] = useState(false)
  const { mutate, data, isPending, reset } = useRevealContact()

  if (data) {
    return (
      <Typography variant="body2" color="text.secondary">
        {data.phone} / {data.address}
      </Typography>
    )
  }

  if (!open) {
    return (
      <Tooltip title="열람 사유가 접근 로그에 기록됩니다">
        <Button
          size="small"
          startIcon={<VisibilityIcon />}
          onClick={() => setOpen(true)}
        >
          원본 정보 보기
        </Button>
      </Tooltip>
    )
  }

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <TextField
        size="small"
        label="열람 사유"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <Button
        size="small"
        variant="contained"
        disabled={!reason || isPending}
        onClick={() => mutate({ customerId, reason })}
      >
        확인
      </Button>
      <Button
        size="small"
        onClick={() => {
          setOpen(false)
          reset()
        }}
      >
        취소
      </Button>
    </Stack>
  )
}

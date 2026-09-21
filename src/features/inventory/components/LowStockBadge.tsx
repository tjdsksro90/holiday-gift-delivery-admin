import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Tooltip } from '@mui/material'

export function LowStockBadge() {
  return (
    <Tooltip title="재고 부족 — 발주 확인 필요">
      <WarningAmberIcon
        color="warning"
        fontSize="small"
        sx={{ verticalAlign: 'middle' }}
      />
    </Tooltip>
  )
}

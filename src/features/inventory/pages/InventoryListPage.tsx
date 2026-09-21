import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material'
import { useInventory } from '../hooks/useInventory'
import { InventoryTable } from '../components/InventoryTable'

export function InventoryListPage() {
  const { data, isLoading, isError } = useInventory()
  const hasLowStock = data?.items.some((item) => item.stockQuantity <= item.safetyStock)

  return (
    <Stack spacing={2}>
      <Typography variant="h5">재고 관리</Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {isError && <Alert severity="error">재고 목록을 불러오지 못했습니다.</Alert>}

      {data && (
        <>
          {hasLowStock && (
            <Alert severity="warning">
              안전재고 이하로 떨어진 상품이 있습니다. 발주를 확인해주세요.
            </Alert>
          )}
          <InventoryTable items={data.items} />
        </>
      )}
    </Stack>
  )
}

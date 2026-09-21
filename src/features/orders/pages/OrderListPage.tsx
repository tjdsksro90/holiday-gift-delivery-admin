import { useState } from 'react'
import { Alert, Box, CircularProgress, Pagination, Stack, Typography } from '@mui/material'
import { useOrders } from '../hooks/useOrders'
import { OrderTable } from '../components/OrderTable'

const PAGE_SIZE = 20

export function OrderListPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useOrders({ page, pageSize: PAGE_SIZE })

  return (
    <Stack spacing={2}>
      <Typography variant="h5">주문 관리</Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {isError && <Alert severity="error">주문 목록을 불러오지 못했습니다.</Alert>}

      {data && (
        <>
          <OrderTable orders={data.items} />
          <Pagination
            count={Math.ceil(data.total / PAGE_SIZE)}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </>
      )}
    </Stack>
  )
}

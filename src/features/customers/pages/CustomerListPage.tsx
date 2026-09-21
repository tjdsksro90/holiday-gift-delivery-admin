import { useState } from 'react'
import {
  Alert,
  Box,
  CircularProgress,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useCustomers } from '../hooks/useCustomers'
import { CustomerTable } from '../components/CustomerTable'

const PAGE_SIZE = 20

export function CustomerListPage() {
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const { data, isLoading, isError } = useCustomers({
    page,
    pageSize: PAGE_SIZE,
    keyword: keyword || undefined,
  })

  return (
    <Stack spacing={2}>
      <Typography variant="h5">고객 관리</Typography>
      <TextField
        size="small"
        label="이름/연락처 검색"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value)
          setPage(1)
        }}
        sx={{ maxWidth: 320 }}
      />

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {isError && <Alert severity="error">고객 목록을 불러오지 못했습니다.</Alert>}

      {data && (
        <>
          <CustomerTable customers={data.items} />
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

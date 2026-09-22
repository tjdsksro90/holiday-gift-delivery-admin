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
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useCustomers } from '../hooks/useCustomers'
import { CustomerTable } from '../components/CustomerTable'

const PAGE_SIZE = 20
const SEARCH_DEBOUNCE_MS = 300

export function CustomerListPage() {
  const [page, setPage] = useState(1)
  const [keywordInput, setKeywordInput] = useState('')
  // 매 keystroke마다 API를 호출하지 않도록 실제 검색에는 디바운스된 값을 쓴다.
  const keyword = useDebouncedValue(keywordInput, SEARCH_DEBOUNCE_MS)

  // 검색어가 실제로 바뀐 시점에 페이지를 1로 되돌린다. useEffect+setState 대신
  // 렌더링 중 비교로 처리해 불필요한 추가 렌더 사이클을 만들지 않는다.
  const [appliedKeyword, setAppliedKeyword] = useState(keyword)
  if (keyword !== appliedKeyword) {
    setAppliedKeyword(keyword)
    setPage(1)
  }

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
        value={keywordInput}
        onChange={(e) => setKeywordInput(e.target.value)}
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

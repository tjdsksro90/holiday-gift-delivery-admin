import { useEffect, useState } from 'react'

/** 값이 delayMs 동안 더 바뀌지 않을 때만 최신 값을 반영한다 (검색어 입력 등에 사용). */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)
  }, [value, delayMs])

  return debounced
}

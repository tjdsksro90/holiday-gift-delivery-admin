import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDebouncedValue } from './useDebouncedValue'

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('지정한 시간이 지나기 전에는 이전 값을 유지한다', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('a')
  })

  it('지정한 시간이 지나면 최신 값으로 갱신된다', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('ab')
  })

  it('값이 짧은 간격으로 계속 바뀌면 마지막 값 기준으로 타이머가 다시 시작된다', () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 300), {
      initialProps: { value: 'a' },
    })

    rerender({ value: 'ab' })
    act(() => {
      vi.advanceTimersByTime(200)
    })
    rerender({ value: 'abc' })
    act(() => {
      vi.advanceTimersByTime(200)
    })

    // 마지막 변경('abc') 이후 200ms만 지났으므로 아직 반영되지 않는다
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(100)
    })

    expect(result.current).toBe('abc')
  })
})

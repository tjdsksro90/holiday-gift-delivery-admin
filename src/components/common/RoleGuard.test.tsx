import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '@/store/authStore'
import { RoleGuard } from './RoleGuard'

afterEach(() => {
  useAuthStore.getState().clear()
})

describe('RoleGuard', () => {
  it('허용된 role이면 children을 보여준다', () => {
    useAuthStore.getState().setUser({ id: 'u1', displayName: '홍길동', role: 'ADMIN' })

    render(
      <RoleGuard allow={['ADMIN']}>
        <button>재고 조정</button>
      </RoleGuard>,
    )

    expect(screen.getByRole('button', { name: '재고 조정' })).toBeInTheDocument()
  })

  it('허용되지 않은 role이면 children을 숨긴다', () => {
    useAuthStore.getState().setUser({ id: 'u2', displayName: '김철수', role: 'VIEWER' })

    render(
      <RoleGuard allow={['ADMIN']}>
        <button>재고 조정</button>
      </RoleGuard>,
    )

    expect(screen.queryByRole('button', { name: '재고 조정' })).not.toBeInTheDocument()
  })

  it('로그인 전(role 없음)에는 fallback을 보여준다', () => {
    render(
      <RoleGuard allow={['ADMIN']} fallback={<span>권한 없음</span>}>
        <button>재고 조정</button>
      </RoleGuard>,
    )

    expect(screen.getByText('권한 없음')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '재고 조정' })).not.toBeInTheDocument()
  })
})

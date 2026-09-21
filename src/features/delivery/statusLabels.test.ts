import { describe, expect, it } from 'vitest'
import {
  DELIVERY_FAILABLE_STATUSES,
  DELIVERY_STATUS_FLOW,
  isTerminalDeliveryStatus,
  nextDeliveryStatus,
} from './statusLabels'

describe('nextDeliveryStatus', () => {
  it('정상 흐름을 따라 다음 상태를 반환한다', () => {
    expect(nextDeliveryStatus('READY')).toBe('PICKED_UP')
    expect(nextDeliveryStatus('OUT_FOR_DELIVERY')).toBe('COMPLETED')
  })

  it('마지막 단계(COMPLETED)에서는 더 진행할 곳이 없다', () => {
    expect(nextDeliveryStatus('COMPLETED')).toBeNull()
  })

  it('FAILED는 정상 흐름 밖이라 다음 단계가 없다', () => {
    expect(nextDeliveryStatus('FAILED')).toBeNull()
  })
})

describe('isTerminalDeliveryStatus', () => {
  it('COMPLETED와 FAILED만 종료 상태로 취급한다', () => {
    expect(isTerminalDeliveryStatus('COMPLETED')).toBe(true)
    expect(isTerminalDeliveryStatus('FAILED')).toBe(true)
    expect(isTerminalDeliveryStatus('IN_TRANSIT')).toBe(false)
  })
})

describe('DELIVERY_FAILABLE_STATUSES', () => {
  it('READY(집화 전)와 종료 상태는 실패 처리 대상이 아니다', () => {
    expect(DELIVERY_FAILABLE_STATUSES).not.toContain('READY')
    expect(DELIVERY_FAILABLE_STATUSES).not.toContain('COMPLETED')
    expect(DELIVERY_FAILABLE_STATUSES).not.toContain('FAILED')
  })

  it('집화 완료~배송 출발 사이 상태는 실패 처리할 수 있다', () => {
    expect(DELIVERY_FAILABLE_STATUSES).toEqual(['PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY'])
  })
})

describe('DELIVERY_STATUS_FLOW', () => {
  it('nextDeliveryStatus로 끝까지 따라가면 흐름 배열과 순서가 같다', () => {
    const visited: string[] = [DELIVERY_STATUS_FLOW[0]]
    let current = DELIVERY_STATUS_FLOW[0]
    let next = nextDeliveryStatus(current)
    while (next) {
      visited.push(next)
      current = next
      next = nextDeliveryStatus(current)
    }
    expect(visited).toEqual(DELIVERY_STATUS_FLOW)
  })
})

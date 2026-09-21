import { describe, expect, it } from 'vitest'
import { nextDeliveryStatus } from '@/features/delivery/statusLabels'
import { advanceDelivery, failDelivery, getDelivery } from './deliveries'

describe('getDelivery', () => {
  it('배송 정보가 없는 주문(deliveryId 없음)은 undefined를 반환한다', () => {
    expect(getDelivery('order-1')).toBeUndefined()
  })

  it('존재하지 않는 주문도 undefined를 반환한다', () => {
    expect(getDelivery('no-such-order')).toBeUndefined()
  })

  it('같은 주문을 다시 조회하면 이전 상태를 그대로 돌려준다(새로 계산하지 않는다)', () => {
    // getDelivery는 스토어에 있는 객체를 그대로 돌려주므로(참조 공유),
    // 비교할 값은 미리 원시값으로 꺼내둬야 한다 — 그렇지 않으면 advanceDelivery가
    // 같은 객체를 변경할 때 "이전" 값도 같이 바뀌어버린다.
    const beforeStatus = getDelivery('order-4')!.status
    const beforeEventCount = getDelivery('order-4')!.events.length

    advanceDelivery('order-4')
    const after = getDelivery('order-4')!

    expect(after.status).not.toBe(beforeStatus)
    expect(after.events.length).toBe(beforeEventCount + 1)
  })
})

describe('advanceDelivery', () => {
  it('현재 상태의 다음 단계로 진행하고 타임라인에 이벤트를 추가한다', () => {
    const beforeStatus = getDelivery('order-10')!.status
    const beforeEventCount = getDelivery('order-10')!.events.length
    const expectedNext = nextDeliveryStatus(beforeStatus)

    const result = advanceDelivery('order-10')

    expect(result?.changed).toBe(true)
    expect(result?.delivery.status).toBe(expectedNext)
    expect(result?.delivery.events[0]?.status).toBe(expectedNext)
    expect(result?.delivery.events.length).toBe(beforeEventCount + 1)
  })

  it('배송완료까지 도달하면 더 이상 진행되지 않는다', () => {
    advanceDelivery('order-16') // 간선이동중 -> 배송출발
    const completed = advanceDelivery('order-16') // 배송출발 -> 배송완료
    expect(completed?.delivery.status).toBe('COMPLETED')

    const again = advanceDelivery('order-16')

    expect(again?.changed).toBe(false)
    expect(again?.delivery.status).toBe('COMPLETED')
  })

  it('배송 정보가 없는 주문은 undefined를 반환한다', () => {
    expect(advanceDelivery('order-2')).toBeUndefined()
  })
})

describe('failDelivery', () => {
  it('진행 중인 배송은 실패 처리할 수 있다', () => {
    const beforeEventCount = getDelivery('order-22')!.events.length

    const result = failDelivery('order-22')

    expect(result?.changed).toBe(true)
    expect(result?.delivery.status).toBe('FAILED')
    expect(result?.delivery.events[0]?.status).toBe('FAILED')
    expect(result?.delivery.events.length).toBe(beforeEventCount + 1)
  })

  it('한 단계 더 진행한 뒤에도 실패 처리할 수 있다', () => {
    advanceDelivery('order-28') // 간선이동중 -> 배송출발

    const result = failDelivery('order-28')

    expect(result?.changed).toBe(true)
    expect(result?.delivery.status).toBe('FAILED')
  })

  it('이미 배송완료된 건은 실패 처리할 수 없다', () => {
    const before = getDelivery('order-5')! // 배송완료 주문 -> 배송완료 상태로 시작
    expect(before.status).toBe('COMPLETED')

    const result = failDelivery('order-5')

    expect(result?.changed).toBe(false)
    expect(result?.delivery.status).toBe('COMPLETED')
  })

  it('이미 실패 처리된 배송은 다시 실패 처리할 수 없다', () => {
    failDelivery('order-34')

    const result = failDelivery('order-34')

    expect(result?.changed).toBe(false)
    expect(result?.delivery.status).toBe('FAILED')
  })

  it('배송 정보가 없는 주문은 undefined를 반환한다', () => {
    expect(failDelivery('order-3')).toBeUndefined()
  })
})

import { describe, expect, it } from 'vitest'
import {
  findMaskedCustomer,
  findRawCustomer,
  maskedCustomers,
  rawCustomers,
  searchMaskedCustomers,
} from './customers'

describe('rawCustomers / maskedCustomers', () => {
  it('원본 고객 수만큼 마스킹된 고객 목록이 만들어진다', () => {
    expect(maskedCustomers.length).toBe(rawCustomers.length)
  })

  it('마스킹된 목록에는 원본 전화번호/주소가 그대로 노출되지 않는다', () => {
    rawCustomers.forEach((raw, i) => {
      const masked = maskedCustomers[i]
      expect(masked.phoneMasked).not.toBe(raw.phone)
      expect(masked.addressMasked).not.toBe(raw.address)
      expect(masked.phoneMasked).toContain('****')
      expect(masked.addressMasked).toContain('*****')
    })
  })

  it('id/이름/등급/가입일은 원본과 동일하게 유지된다', () => {
    const raw = rawCustomers[0]
    const masked = maskedCustomers[0]
    expect(masked.id).toBe(raw.id)
    expect(masked.name).toBe(raw.name)
    expect(masked.membershipTier).toBe(raw.membershipTier)
    expect(masked.createdAt).toBe(raw.createdAt)
  })
})

describe('findRawCustomer / findMaskedCustomer', () => {
  it('존재하는 id면 각각 원본/마스킹된 고객 정보를 반환한다', () => {
    expect(findRawCustomer('cust-1')?.name).toBe(rawCustomers[0].name)
    expect(findMaskedCustomer('cust-1')?.phoneMasked).toContain('****')
  })

  it('존재하지 않는 id면 둘 다 undefined를 반환한다', () => {
    expect(findRawCustomer('no-such-customer')).toBeUndefined()
    expect(findMaskedCustomer('no-such-customer')).toBeUndefined()
  })
})

describe('searchMaskedCustomers', () => {
  it('키워드가 없으면 전체 목록을 반환한다', () => {
    expect(searchMaskedCustomers()).toHaveLength(maskedCustomers.length)
    expect(searchMaskedCustomers('   ')).toHaveLength(maskedCustomers.length)
  })

  it('이름에 키워드가 포함된 고객만 반환한다', () => {
    const target = maskedCustomers[0]
    const keyword = target.name.slice(0, 1)

    const result = searchMaskedCustomers(keyword)

    expect(result.length).toBeGreaterThan(0)
    result.forEach((customer) => expect(customer.name).toContain(keyword))
  })

  it('일치하는 고객이 없으면 빈 배열을 반환한다', () => {
    expect(searchMaskedCustomers('존재하지않는이름123')).toEqual([])
  })
})

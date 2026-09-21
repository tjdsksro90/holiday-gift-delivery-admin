import { describe, expect, it } from 'vitest'
import { maskAddress, maskName, maskPhone } from './mask'

describe('maskPhone', () => {
  it('앞 3자리와 뒤 4자리만 남기고 가운데를 가린다', () => {
    expect(maskPhone('010-1234-5678')).toBe('010-****-5678')
  })

  it('숫자가 아닌 문자가 섞여 있어도 동일하게 동작한다', () => {
    expect(maskPhone('010 1234 5678')).toBe('010-****-5678')
  })

  it('전화번호로 보기엔 너무 짧으면 전부 가린다', () => {
    expect(maskPhone('123')).toBe('***-****-****')
  })
})

describe('maskName', () => {
  it('두 글자면 성만 남긴다', () => {
    expect(maskName('김민')).toBe('김*')
  })

  it('세 글자 이상이면 첫/끝 글자만 남긴다', () => {
    expect(maskName('김민준')).toBe('김*준')
  })

  it('한 글자면 그대로 둔다', () => {
    expect(maskName('김')).toBe('김')
  })
})

describe('maskAddress', () => {
  it('앞 두 단어만 남기고 나머지를 가린다', () => {
    expect(maskAddress('서울시 강남구 1동 100호')).toBe('서울시 강남구 *****')
  })

  it('단어가 하나뿐이면 전부 가린다', () => {
    expect(maskAddress('서울시')).toBe('*****')
  })
})

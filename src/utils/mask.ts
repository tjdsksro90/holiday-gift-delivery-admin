/**
 * 서버가 이미 마스킹된 값을 내려주는 것을 기본 전제로 하되,
 * 화면단에서 실수로 원본 값을 그대로 렌더링하는 것을 막기 위한 방어적 유틸리티.
 * 절대 이 함수들로 "보안"을 대체하지 말 것 — 마스킹 해제는 반드시 서버 API로 처리한다.
 */

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 9) return '***-****-****'
  const last4 = digits.slice(-4)
  const prefix = digits.slice(0, 3)
  return `${prefix}-****-${last4}`
}

export function maskName(name: string): string {
  if (name.length <= 1) return name
  if (name.length === 2) return `${name[0]}*`
  return `${name[0]}${'*'.repeat(name.length - 2)}${name[name.length - 1]}`
}

export function maskAddress(address: string): string {
  const parts = address.trim().split(/\s+/)
  if (parts.length <= 1) return '*****'
  const visible = parts.slice(0, 2).join(' ')
  return `${visible} *****`
}

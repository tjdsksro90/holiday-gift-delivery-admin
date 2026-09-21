import { maskAddress, maskPhone } from '@/utils/mask'
import type { Customer, MembershipTier } from '@/types/customer'

interface RawCustomer extends Omit<Customer, 'phoneMasked' | 'addressMasked'> {
  phone: string
  address: string
}

const SURNAMES = ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임']
const GIVEN_NAMES = ['민준', '서연', '지훈', '수아', '예은', '도윤', '하은', '지호', '유진', '태양']
const DISTRICTS = ['서울시 강남구', '서울시 마포구', '경기도 성남시', '부산시 해운대구', '인천시 연수구']
const TIERS: MembershipTier[] = ['GENERAL', 'SILVER', 'GOLD', 'VIP']

function buildCustomer(index: number): RawCustomer {
  const name = `${SURNAMES[index % SURNAMES.length]}${GIVEN_NAMES[index % GIVEN_NAMES.length]}`
  const phone = `010-${String(1000 + index).padStart(4, '0')}-${String(2000 + index).padStart(4, '0')}`
  const address = `${DISTRICTS[index % DISTRICTS.length]} ${index + 1}동 ${100 + index}호`
  return {
    id: `cust-${index + 1}`,
    name,
    phone,
    address,
    membershipTier: TIERS[index % TIERS.length],
    createdAt: new Date(2026, 0, 1 + index).toISOString(),
  }
}

export const rawCustomers: RawCustomer[] = Array.from({ length: 47 }, (_, i) =>
  buildCustomer(i),
)

export const maskedCustomers: Customer[] = rawCustomers.map((c) => ({
  id: c.id,
  name: c.name,
  phoneMasked: maskPhone(c.phone),
  addressMasked: maskAddress(c.address),
  membershipTier: c.membershipTier,
  createdAt: c.createdAt,
}))

export function findRawCustomer(id: string): RawCustomer | undefined {
  return rawCustomers.find((c) => c.id === id)
}

export function findMaskedCustomer(id: string): Customer | undefined {
  return maskedCustomers.find((c) => c.id === id)
}

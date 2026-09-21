import { authHandlers } from './auth'
import { customerHandlers } from './customers'
import { deliveryHandlers } from './delivery'
import { orderHandlers } from './orders'

export const handlers = [
  ...authHandlers,
  ...customerHandlers,
  ...orderHandlers,
  ...deliveryHandlers,
]

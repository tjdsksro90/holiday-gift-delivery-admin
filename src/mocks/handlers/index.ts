import { authHandlers } from './auth'
import { customerHandlers } from './customers'
import { deliveryHandlers } from './delivery'
import { inventoryHandlers } from './inventory'
import { orderHandlers } from './orders'

export const handlers = [
  ...authHandlers,
  ...customerHandlers,
  ...orderHandlers,
  ...deliveryHandlers,
  ...inventoryHandlers,
]

import { OrderStatus } from '../../types'
import clsx from 'clsx'

const config: Record<OrderStatus, { label: string; class: string }> = {
  PENDING:        { label: 'En attente',      class: 'bg-yellow-100 text-yellow-700' },
  IN_PREPARATION: { label: 'En préparation',  class: 'bg-blue-100 text-blue-700' },
  READY:          { label: 'Prêt',            class: 'bg-green-100 text-green-700' },
  DELIVERED:      { label: 'Livré',           class: 'bg-purple-100 text-purple-700' },
  PAID:           { label: 'Payé',            class: 'bg-gray-100 text-gray-600' },
  CANCELLED:      { label: 'Annulé',          class: 'bg-red-100 text-red-600' },
}

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, class: cls } = config[status] ?? { label: status, class: 'bg-gray-100 text-gray-600' }
  return <span className={clsx('badge', cls)}>{label}</span>
}

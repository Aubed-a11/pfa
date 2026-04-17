import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '../../lib/api'
import { Order, OrderStatus } from '../../types'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'
import { ChevronDown } from 'lucide-react'

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'IN_PREPARATION',
  IN_PREPARATION: 'READY',
  READY: 'DELIVERED',
  DELIVERED: 'PAID',
}

export default function OrdersPage() {
  const qc = useQueryClient()

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.getAll().then((r) => r.data.data as Order[]),
    refetchInterval: 10000,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      orderApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Commandes</h1>
        <p className="text-gray-500 mt-1">{orders.length} commandes au total</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Chargement...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-6 text-gray-500 font-medium">N°</th>
                <th className="text-left py-3 px-6 text-gray-500 font-medium">Table</th>
                <th className="text-left py-3 px-6 text-gray-500 font-medium">Client</th>
                <th className="text-left py-3 px-6 text-gray-500 font-medium">Articles</th>
                <th className="text-left py-3 px-6 text-gray-500 font-medium">Statut</th>
                <th className="text-right py-3 px-6 text-gray-500 font-medium">Total</th>
                <th className="text-left py-3 px-6 text-gray-500 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">#{order.id}</td>
                  <td className="py-4 px-6">Table {order.tableNumber}</td>
                  <td className="py-4 px-6">{order.user?.name}</td>
                  <td className="py-4 px-6">{order.items?.length ?? 0} article(s)</td>
                  <td className="py-4 px-6"><OrderStatusBadge status={order.status} /></td>
                  <td className="py-4 px-6 text-right font-bold">{order.totalAmount?.toFixed(2)} MAD</td>
                  <td className="py-4 px-6">
                    {NEXT_STATUS[order.status] && (
                      <button
                        onClick={() => updateMutation.mutate({ id: order.id, status: NEXT_STATUS[order.status]! })}
                        className="flex items-center gap-1 text-xs bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        Avancer <ChevronDown size={14} className="-rotate-90" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={7} className="py-12 text-center text-gray-400">Aucune commande</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

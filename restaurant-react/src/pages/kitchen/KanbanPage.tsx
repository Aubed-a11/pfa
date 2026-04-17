import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderApi } from '../../lib/api'
import { Order, OrderStatus } from '../../types'
import { useOrdersWebSocket } from '../../hooks/useOrders'
import { Clock } from 'lucide-react'

const COLUMNS: { status: OrderStatus; label: string; color: string }[] = [
  { status: 'PENDING',        label: 'En attente',     color: 'border-yellow-400' },
  { status: 'IN_PREPARATION', label: 'En préparation', color: 'border-blue-400' },
  { status: 'READY',          label: 'Prêt',           color: 'border-green-400' },
]

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'IN_PREPARATION',
  IN_PREPARATION: 'READY',
}

export default function KanbanPage() {
  useOrdersWebSocket()
  const qc = useQueryClient()

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.getAll().then((r) => r.data.data as Order[]),
    refetchInterval: 5000,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      orderApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  })

  const getElapsed = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime()
    const mins = Math.floor(diff / 60000)
    return mins < 60 ? `${mins}min` : `${Math.floor(mins / 60)}h${mins % 60}min`
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 p-6 overflow-hidden">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-gray-900">Cuisine — Kanban</h1>
          <p className="text-gray-500 mt-1">Gestion des commandes en temps réel</p>
        </div>

        <div className="grid grid-cols-3 gap-5 h-[calc(100vh-140px)]">
          {COLUMNS.map(({ status, label, color }) => {
            const colOrders = orders.filter((o) => o.status === status)
            return (
              <div key={status} className="flex flex-col">
                <div className={`flex items-center justify-between mb-3 pb-2 border-b-2 ${color}`}>
                  <h2 className="font-semibold text-gray-700">{label}</h2>
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {colOrders.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {colOrders.map((order) => (
                    <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-gray-900">Table {order.tableNumber}</span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} />
                          {getElapsed(order.createdAt)}
                        </span>
                      </div>

                      <div className="space-y-1 mb-4">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-gray-700">{item.dish?.name}</span>
                            <span className="font-medium text-gray-900">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {NEXT[order.status] && (
                        <button
                          onClick={() => updateMutation.mutate({ id: order.id, status: NEXT[order.status]! })}
                          className="w-full btn-primary py-2 text-sm"
                        >
                          {order.status === 'PENDING' ? '▶ Commencer' : '✓ Marquer prêt'}
                        </button>
                      )}
                    </div>
                  ))}

                  {colOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-300 text-sm">Aucune commande</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

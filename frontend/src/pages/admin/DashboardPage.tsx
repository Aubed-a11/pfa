import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react'
import { statsApi, orderApi } from '../../lib/api'
import StatCard from '../../components/ui/StatCard'
import OrderStatusBadge from '../../components/ui/OrderStatusBadge'
import { Order } from '../../types'

export default function DashboardPage() {
  const { data: statsData } = useQuery({
    queryKey: ['stats'],
    queryFn: () => statsApi.getSummary().then((r) => r.data.data),
  })

  const { data: ordersData } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderApi.getAll().then((r) => r.data.data),
  })

  const orders: Order[] = ordersData ?? []
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de votre restaurant</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Chiffre d'affaires"
          value={`${(statsData?.totalRevenue ?? 0).toFixed(2)} MAD`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Commandes totales"
          value={statsData?.totalOrders ?? 0}
          icon={ShoppingBag}
          color="blue"
        />
        <StatCard
          title="Panier moyen"
          value={`${(statsData?.avgOrderValue ?? 0).toFixed(2)} MAD`}
          icon={TrendingUp}
          color="orange"
        />
        <StatCard
          title="Commandes actives"
          value={orders.filter((o) => ['PENDING', 'IN_PREPARATION'].includes(o.status)).length}
          icon={Users}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Revenus des 7 derniers jours</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statsData?.revenueByDay ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Plats populaires</h2>
          <div className="space-y-3">
            {(statsData?.popularDishes ?? []).slice(0, 5).map((d: {dishName: string; count: number}, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate">{d.dishName}</span>
                <span className="text-sm font-semibold text-primary-600 ml-2">{d.count}x</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <h2 className="font-semibold text-gray-900 mb-4">DerniÃ¨res commandes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 text-gray-500 font-medium">NÂ°</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Table</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Client</th>
                <th className="text-left py-3 px-2 text-gray-500 font-medium">Statut</th>
                <th className="text-right py-3 px-2 text-gray-500 font-medium">Montant</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium">#{order.id}</td>
                  <td className="py-3 px-2">Table {order.tableNumber}</td>
                  <td className="py-3 px-2">{order.user?.name}</td>
                  <td className="py-3 px-2"><OrderStatusBadge status={order.status} /></td>
                  <td className="py-3 px-2 text-right font-semibold">{order.totalAmount.toFixed(2)} MAD</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">Aucune commande</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

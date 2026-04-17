import { useQuery } from '@tanstack/react-query'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { statsApi } from '../../lib/api'

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f43f5e']

export default function StatsPage() {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => statsApi.getSummary().then((r) => r.data.data),
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Statistiques</h1>
        <p className="text-gray-500 mt-1">Analyse de performance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Revenus par jour</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats?.revenueByDay ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [`${v.toFixed(2)} MAD`, 'Revenus']} />
              <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Plats les plus vendus</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats?.popularDishes?.slice(0, 6) ?? []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="dishName" type="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">RÃ©partition des ventes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats?.popularDishes?.slice(0, 5) ?? []}
                dataKey="count"
                nameKey="dishName"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {(stats?.popularDishes?.slice(0, 5) ?? []).map((_: unknown, i: number) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">RÃ©sumÃ© financier</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Chiffre d'affaires total</span>
              <span className="font-bold text-green-600">{stats?.totalRevenue?.toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Nombre de commandes</span>
              <span className="font-bold">{stats?.totalOrders}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Panier moyen</span>
              <span className="font-bold text-primary-600">{stats?.avgOrderValue?.toFixed(2)} MAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

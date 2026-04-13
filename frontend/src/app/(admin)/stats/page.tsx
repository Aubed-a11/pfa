"use client";
import { useQuery } from "@tanstack/react-query";
import { orderApi, statsApi } from "@/lib/api";
import { DashboardStats, Order } from "@/types";
import { formatPrice, ORDER_STATUS_LABELS } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const PIE_COLORS = ["#3b82f6", "#f59e0b", "#22c55e", "#6b7280", "#ef4444"];

export default function StatsPage() {
  const { data: statsData } = useQuery<{ data: { data: DashboardStats } }>({
    queryKey: ["stats", "dashboard"],
    queryFn: statsApi.getDashboard,
    refetchInterval: 60_000,
  });

  const { data: ordersData } = useQuery<{ data: { data: Order[] } }>({
    queryKey: ["orders", "active"],
    queryFn: orderApi.getActive,
  });

  const stats: DashboardStats = statsData?.data?.data ?? {
    revenueToday: 0, revenueMonth: 0, ordersToday: 0, totalUsers: 0,
  };

  const orders: Order[] = ordersData?.data?.data ?? [];

  // Répartition par statut
  const statusCounts = ["RECEIVED", "PREPARING", "READY", "SERVED", "CANCELLED"].map((s) => ({
    name: ORDER_STATUS_LABELS[s],
    value: orders.filter((o) => o.status === s).length,
  }));

  // Répartition par type
  const typeCounts = [
    { name: "Sur place",   value: orders.filter((o) => o.type === "DINE_IN").length },
    { name: "À emporter",  value: orders.filter((o) => o.type === "TAKEAWAY").length },
    { name: "Livraison",   value: orders.filter((o) => o.type === "DELIVERY").length },
  ];

  // Top plats
  const dishCount: Record<string, number> = {};
  orders.forEach((o) =>
    o.items.forEach((i) => {
      dishCount[i.dishName] = (dishCount[i.dishName] || 0) + i.quantity;
    })
  );
  const topDishes = Object.entries(dishCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Statistiques</h1>
        <p className="text-stone-500 text-sm mt-1">Analyse des performances de votre restaurant</p>
      </div>

      {/* KPIs résumé */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "CA aujourd'hui", value: formatPrice(stats.revenueToday), color: "text-brand-600" },
          { label: "CA ce mois",     value: formatPrice(stats.revenueMonth), color: "text-green-600" },
          { label: "Commandes",       value: String(stats.ordersToday),       color: "text-blue-600"  },
          { label: "Clients total",   value: String(stats.totalUsers),        color: "text-purple-600"},
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-5 text-center">
            <p className="text-stone-500 text-sm">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Graphes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Plats les plus commandés */}
        <div className="card p-5">
          <h2 className="font-semibold text-stone-900 mb-4">Plats les plus commandés</h2>
          {topDishes.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-stone-400 text-sm">Aucune donnée</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topDishes} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip formatter={(v) => [`${v} cmd`, "Qté"]} />
                <Bar dataKey="count" fill="#ea580c" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Répartition par statut */}
        <div className="card p-5">
          <h2 className="font-semibold text-stone-900 mb-4">Répartition par statut</h2>
          {statusCounts.every((s) => s.value === 0) ? (
            <div className="flex items-center justify-center h-48 text-stone-400 text-sm">Aucune donnée</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusCounts.filter((s) => s.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={false}
                >
                  {statusCounts.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Répartition par type */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="font-semibold text-stone-900 mb-4">Commandes par type</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={typeCounts}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`${v}`, "Commandes"]} />
              <Bar dataKey="value" fill="#0ea5e9" radius={[6, 6, 0, 0]}>
                {typeCounts.map((_, i) => (
                  <Cell key={i} fill={["#ea580c", "#0ea5e9", "#8b5cf6"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

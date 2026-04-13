"use client";
import { useQuery } from "@tanstack/react-query";
import { statsApi, orderApi } from "@/lib/api";
import { StatCard } from "@/components/dashboard/StatCard";
import { DashboardStats, Order } from "@/types";
import {
  TrendingUp, ShoppingBag, Users, DollarSign,
  Clock, CheckCircle2, ChefHat, XCircle,
} from "lucide-react";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "@/lib/utils";

export default function DashboardPage() {
  const { data: statsData } = useQuery<{ data: { data: DashboardStats } }>({
    queryKey: ["stats", "dashboard"],
    queryFn: () => statsApi.getDashboard(),
    refetchInterval: 30_000,
  });

  const { data: ordersData } = useQuery<{ data: { data: Order[] } }>({
    queryKey: ["orders", "active"],
    queryFn: () => orderApi.getActive(),
    refetchInterval: 10_000,
  });

  const stats: DashboardStats = statsData?.data?.data ?? {
    revenueToday: 0,
    revenueMonth: 0,
    ordersToday: 0,
    totalUsers: 0,
  };

  const activeOrders: Order[] = ordersData?.data?.data ?? [];

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Tableau de bord</h1>
        <p className="text-stone-500 text-sm mt-1">Vue d'ensemble de votre restaurant en temps réel</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="CA aujourd'hui"
          value={formatPrice(stats.revenueToday)}
          icon={DollarSign}
          color="orange"
          subtitle="Paiements validés"
        />
        <StatCard
          title="CA ce mois"
          value={formatPrice(stats.revenueMonth)}
          icon={TrendingUp}
          color="green"
          subtitle="Mois en cours"
        />
        <StatCard
          title="Commandes aujourd'hui"
          value={String(stats.ordersToday)}
          icon={ShoppingBag}
          color="blue"
          subtitle="Toutes tables confondues"
        />
        <StatCard
          title="Clients enregistrés"
          value={String(stats.totalUsers)}
          icon={Users}
          color="purple"
          subtitle="Total comptes actifs"
        />
      </div>

      {/* Commandes actives */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ChefHat size={18} className="text-brand-600" />
            <h2 className="font-semibold text-stone-900">Commandes en cours</h2>
          </div>
          <span className="badge bg-brand-100 text-brand-700">
            {activeOrders.length} active{activeOrders.length !== 1 ? "s" : ""}
          </span>
        </div>

        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-stone-400">
            <CheckCircle2 size={40} className="mb-3 text-green-400" />
            <p className="font-medium text-stone-500">Aucune commande en cours</p>
            <p className="text-sm mt-1">Toutes les commandes sont traitées</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">N° commande</th>
                  <th className="px-5 py-3 text-left">Client</th>
                  <th className="px-5 py-3 text-left">Type</th>
                  <th className="px-5 py-3 text-left">Articles</th>
                  <th className="px-5 py-3 text-right">Montant</th>
                  <th className="px-5 py-3 text-left">Statut</th>
                  <th className="px-5 py-3 text-left">Heure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {activeOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3 font-mono font-medium text-stone-900 text-xs">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3 text-stone-700">{order.customerName}</td>
                    <td className="px-5 py-3 text-stone-500">
                      {order.type === "DINE_IN"
                        ? `Table ${order.tableNumber}`
                        : order.type === "TAKEAWAY"
                        ? "À emporter"
                        : "Livraison"}
                    </td>
                    <td className="px-5 py-3 text-stone-500">{order.items.length} article(s)</td>
                    <td className="px-5 py-3 text-right font-semibold text-stone-900">
                      {formatPrice(order.totalAmount)}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`badge ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-stone-400 text-xs whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Résumé rapide par statut */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { status: "RECEIVED",  label: "Reçues",         icon: Clock,       color: "text-blue-500 bg-blue-50"   },
          { status: "PREPARING", label: "En préparation", icon: ChefHat,     color: "text-amber-600 bg-amber-50" },
          { status: "READY",     label: "Prêtes",         icon: CheckCircle2,color: "text-green-600 bg-green-50" },
          { status: "CANCELLED", label: "Annulées",       icon: XCircle,     color: "text-red-500 bg-red-50"     },
        ].map(({ status, label, icon: Icon, color }) => {
          const count = activeOrders.filter((o) => o.status === status).length;
          return (
            <div key={status} className="card p-4 flex items-center gap-3">
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xl font-bold text-stone-900">{count}</p>
                <p className="text-xs text-stone-500">{label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

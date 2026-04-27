"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { formatDate, ORDER_TYPE_LABELS } from "@/lib/utils";
import { useOrdersWebSocket } from "@/hooks/useOrders";
import { ChefHat, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function KanbanPage() {
  useOrdersWebSocket();
  const qc = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const { data, isLoading } = useQuery<{ data: { data: Order[] } }>({
    queryKey: ["orders", "active"],
    queryFn: orderApi.getActive,
    refetchInterval: 8_000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      orderApi.updateStatus(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders", "active"] });
      toast.success("Statut mis à jour");
    },
  });

  const orders: Order[] = data?.data?.data ?? [];
  const received  = orders.filter((o) => o.status === "RECEIVED");
  const preparing = orders.filter((o) => o.status === "PREPARING");
  const ready     = orders.filter((o) => o.status === "READY");

  const Card = ({ order, nextStatus, nextLabel }: {
    order: Order; nextStatus: OrderStatus | null; nextLabel: string;
  }) => (
    <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-stone-900 bg-stone-100 px-2 py-1 rounded">
          {order.orderNumber}
        </span>
        <span className="text-xs text-stone-400 flex items-center gap-1">
          <Clock size={11} /> {formatDate(order.createdAt)}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-stone-700">{order.customerName}</span>
        <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
          {ORDER_TYPE_LABELS[order.type]}
          {order.tableNumber ? ` · T.${order.tableNumber}` : ""}
        </span>
      </div>

      <div className="border-t border-stone-100 pt-2 space-y-1.5">
        {order.items.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-2">
            <span className="text-sm text-stone-800">
              <span className="font-bold text-brand-600">{item.quantity}×</span> {item.dishName}
            </span>
            {item.specialInstructions && (
              <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded flex-shrink-0">
                {item.specialInstructions}
              </span>
            )}
          </div>
        ))}
      </div>

      {order.notes && (
        <p className="text-xs text-stone-500 bg-stone-50 rounded-lg px-3 py-2 italic">
          Note : {order.notes}
        </p>
      )}

      {nextStatus && (
        <button
          onClick={() => statusMutation.mutate({ id: order.id, status: nextStatus })}
          disabled={statusMutation.isPending}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium bg-brand-600 hover:bg-brand-700 text-white transition-colors disabled:opacity-50"
        >
          {nextLabel} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-stone-900">
      <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-900 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-brand-600 p-2.5 rounded-xl">
            <ChefHat size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-xl font-bold">Vue Cuisine</h1>
            <p className="text-stone-400 text-sm">{orders.length} commande(s) active(s)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-stone-400 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Temps réel
        </div>
      </div>

      {/* Kanban colonnes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Reçues */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-blue-400 font-semibold text-sm uppercase tracking-wide">🔵 Reçues</h2>
            <span className="bg-blue-900/50 text-blue-300 text-xs px-2 py-0.5 rounded-full">{received.length}</span>
          </div>
          <div className="space-y-3">
            {received.length === 0 && (
              <div className="text-center text-stone-600 text-sm py-10 border-2 border-dashed border-stone-700 rounded-xl">
                Aucune commande
              </div>
            )}
            {received.map((o) => (
              <Card key={o.id} order={o} nextStatus="PREPARING" nextLabel="Démarrer la préparation" />
            ))}
          </div>
        </div>

        {/* En préparation */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-amber-400 font-semibold text-sm uppercase tracking-wide">🟡 En préparation</h2>
            <span className="bg-amber-900/50 text-amber-300 text-xs px-2 py-0.5 rounded-full">{preparing.length}</span>
          </div>
          <div className="space-y-3">
            {preparing.length === 0 && (
              <div className="text-center text-stone-600 text-sm py-10 border-2 border-dashed border-stone-700 rounded-xl">
                Aucune commande
              </div>
            )}
            {preparing.map((o) => (
              <Card key={o.id} order={o} nextStatus="READY" nextLabel="Marquer comme prête" />
            ))}
          </div>
        </div>

        {/* Prêtes */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-green-400 font-semibold text-sm uppercase tracking-wide">🟢 Prêtes</h2>
            <span className="bg-green-900/50 text-green-300 text-xs px-2 py-0.5 rounded-full">{ready.length}</span>
          </div>
          <div className="space-y-3">
            {ready.length === 0 && (
              <div className="text-center text-stone-600 text-sm py-10 border-2 border-dashed border-stone-700 rounded-xl">
                Aucune commande
              </div>
            )}
            {ready.map((o) => (
              <Card key={o.id} order={o} nextStatus="SERVED" nextLabel="Marquer comme servie" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

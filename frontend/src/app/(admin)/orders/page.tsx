"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, ORDER_TYPE_LABELS } from "@/lib/utils";
import { useOrdersWebSocket } from "@/hooks/useOrders";
import { RefreshCw, Clock } from "lucide-react";
import { toast } from "sonner";

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  RECEIVED:  "PREPARING",
  PREPARING: "READY",
  READY:     "SERVED",
  SERVED:    null,
  CANCELLED: null,
};

const STATUS_NEXT_LABEL: Record<OrderStatus, string> = {
  RECEIVED:  "Démarrer",
  PREPARING: "Marquer prêt",
  READY:     "Marquer servi",
  SERVED:    "",
  CANCELLED: "",
};

export default function OrdersAdminPage() {
  useOrdersWebSocket();
  const qc = useQueryClient();

  const { data, isLoading, refetch } = useQuery<{ data: { data: Order[] } }>({
    queryKey: ["orders", "active"],
    queryFn: orderApi.getActive,
    refetchInterval: 15_000,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) =>
      orderApi.updateStatus(id, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders", "active"] });
      toast.success("Statut mis à jour");
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const orders: Order[] = data?.data?.data ?? [];

  const columns: { status: OrderStatus; label: string; color: string }[] = [
    { status: "RECEIVED",  label: "Reçues",         color: "border-blue-400"  },
    { status: "PREPARING", label: "En préparation", color: "border-amber-400" },
    { status: "READY",     label: "Prêtes",         color: "border-green-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Commandes actives</h1>
          <p className="text-stone-500 text-sm mt-1">{orders.length} commande(s) en cours</p>
        </div>
        <button onClick={() => refetch()} className="btn-secondary flex items-center gap-2">
          <RefreshCw size={15} /> Actualiser
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {columns.map(({ status, label, color }) => {
            const col = orders.filter((o) => o.status === status);
            return (
              <div key={status} className="space-y-3">
                <div className={`flex items-center justify-between px-4 py-2.5 bg-white rounded-xl border-l-4 ${color} shadow-sm`}>
                  <span className="font-semibold text-stone-800">{label}</span>
                  <span className="bg-stone-100 text-stone-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    {col.length}
                  </span>
                </div>

                {col.length === 0 && (
                  <div className="card p-6 text-center text-stone-400 text-sm">Aucune commande</div>
                )}

                {col.map((order) => {
                  const next = STATUS_FLOW[order.status];
                  return (
                    <div key={order.id} className="card p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-xs font-bold text-stone-900">{order.orderNumber}</p>
                          <p className="text-stone-600 text-sm">{order.customerName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-stone-900 text-sm">{formatPrice(order.totalAmount)}</p>
                          <span className="badge bg-stone-100 text-stone-500 text-xs">
                            {ORDER_TYPE_LABELS[order.type]}
                            {order.tableNumber ? ` · Table ${order.tableNumber}` : ""}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 border-t border-stone-100 pt-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between text-xs text-stone-600">
                            <span>{item.quantity}× {item.dishName}</span>
                            <span>{formatPrice(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5">
                          📝 {order.notes}
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-xs text-stone-400">
                          <Clock size={12} />
                          {formatDate(order.createdAt)}
                        </div>
                        {next && (
                          <button
                            onClick={() => statusMutation.mutate({ id: order.id, status: next })}
                            disabled={statusMutation.isPending}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            {STATUS_NEXT_LABEL[order.status]}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

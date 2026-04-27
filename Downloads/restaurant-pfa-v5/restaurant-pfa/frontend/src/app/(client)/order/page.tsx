"use client";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { menuApi, orderApi } from "@/lib/api";
import { CategoryWithDishes, Dish } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { formatPrice, ORDER_TYPE_LABELS } from "@/lib/utils";
import {
  ShoppingCart, Plus, Minus, Trash2, UtensilsCrossed,
  Clock, Star, LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ClientMenuPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { items, addItem, removeItem, updateQty, clearCart, total, count } = useCartStore();
  const [showCart, setShowCart] = useState(false);
  const [orderType, setOrderType] = useState<"DINE_IN" | "TAKEAWAY">("DINE_IN");
  const [tableNumber, setTableNumber] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  const { data, isLoading } = useQuery<{ data: { data: CategoryWithDishes[] } }>({
    queryKey: ["menu", "full"],
    queryFn: menuApi.getFullMenu,
  });

  const orderMutation = useMutation({
    mutationFn: () =>
      orderApi.create({
        items: items.map((i) => ({
          dishId: i.dish.id,
          quantity: i.quantity,
          specialInstructions: i.specialInstructions,
        })),
        type: orderType,
        tableNumber: orderType === "DINE_IN" ? tableNumber : undefined,
      }),
    onSuccess: (res) => {
      const order = res.data.data;
      clearCart();
      setShowCart(false);
      toast.success(`Commande ${order.orderNumber} passée avec succès !`);
    },
    onError: () => toast.error("Erreur lors de la commande"),
  });

  const menu: CategoryWithDishes[] = data?.data?.data ?? [];
  const filtered = activeCategory
    ? menu.filter((c) => c.id === activeCategory)
    : menu;

  const handleLogout = () => { logout(); router.replace("/login"); };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navbar */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-600 p-1.5 rounded-lg">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <span className="font-bold text-stone-900">Menu</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-stone-500 hidden sm:block">Bonjour, {user?.name}</span>
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-brand-600 text-white p-2.5 rounded-xl hover:bg-brand-700 transition-colors"
            >
              <ShoppingCart size={18} />
              {count() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {count()}
                </span>
              )}
            </button>
            <button onClick={handleLogout} className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Catégories */}
        <div className="max-w-5xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null ? "bg-brand-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Tout
          </button>
          {menu.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.id ? "bg-brand-600 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Menu */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-10">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          filtered.map((cat) => (
            <section key={cat.id}>
              <h2 className="text-lg font-bold text-stone-900 mb-4">{cat.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cat.dishes.map((dish) => (
                  <DishCard key={dish.id} dish={dish} onAdd={() => addItem(dish)} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      {/* Panier drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setShowCart(false)} />
          <div className="w-full max-w-sm bg-white flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <h2 className="font-bold text-stone-900 text-lg">Mon panier</h2>
              <button onClick={() => setShowCart(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-stone-400">
                  <ShoppingCart size={40} className="mb-3" />
                  <p className="text-stone-500 font-medium">Panier vide</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.dish.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">{item.dish.name}</p>
                      <p className="text-xs text-stone-400">{formatPrice(item.dish.price)} / unité</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.dish.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:border-brand-400 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.dish.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center hover:border-brand-400 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.dish.id)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Options + total */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-stone-100 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Type de commande</label>
                  <div className="flex gap-2">
                    {(["DINE_IN", "TAKEAWAY"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setOrderType(t)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                          orderType === t
                            ? "bg-brand-600 text-white border-brand-600"
                            : "bg-white text-stone-600 border-stone-200"
                        }`}
                      >
                        {ORDER_TYPE_LABELS[t]}
                      </button>
                    ))}
                  </div>
                </div>

                {orderType === "DINE_IN" && (
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">N° de table</label>
                    <input
                      className="input"
                      placeholder="Ex : 5"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between font-bold">
                  <span>Total</span>
                  <span className="text-brand-600 text-lg">{formatPrice(total())}</span>
                </div>

                <button
                  onClick={() => orderMutation.mutate()}
                  disabled={
                    orderMutation.isPending ||
                    (orderType === "DINE_IN" && !tableNumber.trim())
                  }
                  className="btn-primary w-full py-3"
                >
                  {orderMutation.isPending ? "Envoi…" : "Passer la commande"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DishCard({ dish, onAdd }: { dish: Dish; onAdd: () => void }) {
  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-40 bg-stone-100 flex items-center justify-center overflow-hidden">
        {dish.imageUrl ? (
          <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
        ) : (
          <UtensilsCrossed size={32} className="text-stone-300" />
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-stone-900 text-sm leading-tight">{dish.name}</h3>
          {dish.featured && <Star size={14} className="text-amber-500 fill-amber-500 flex-shrink-0 mt-0.5" />}
        </div>
        {dish.description && (
          <p className="text-xs text-stone-400 line-clamp-2">{dish.description}</p>
        )}
        <div className="flex items-center justify-between pt-1">
          <div>
            <p className="font-bold text-brand-600">{formatPrice(dish.price)}</p>
            {dish.prepTimeMinutes && (
              <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                <Clock size={10} /> {dish.prepTimeMinutes} min
              </p>
            )}
          </div>
          <button
            onClick={onAdd}
            className="bg-brand-600 hover:bg-brand-700 text-white p-2 rounded-xl transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

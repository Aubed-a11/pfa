import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ShoppingCart, Plus, Minus, Trash2, Send } from 'lucide-react'
import { menuApi, orderApi } from '../../lib/api'
import { Dish } from '../../types'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [showCart, setShowCart] = useState(false)
  const { items, addItem, removeItem, updateQuantity, clearCart, total, tableNumber, setTableNumber } = useCartStore()
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => menuApi.getCategories().then((r) => r.data.data),
  })

  const { data: dishes = [] } = useQuery({
    queryKey: ['dishes'],
    queryFn: () => menuApi.getDishes().then((r) => r.data.data as Dish[]),
  })

  const orderMutation = useMutation({
    mutationFn: () => orderApi.create({
      tableNumber,
      items: items.map((i) => ({ dishId: i.dish.id, quantity: i.quantity })),
    }),
    onSuccess: () => {
      clearCart()
      setShowCart(false)
      alert('Commande passée avec succès !')
    },
  })

  const filtered = selectedCategory
    ? dishes.filter((d) => d.category.id === selectedCategory && d.available)
    : dishes.filter((d) => d.available)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-gray-900">Notre Menu</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Table</span>
              <input
                type="number"
                min={1}
                max={50}
                value={tableNumber}
                onChange={(e) => setTableNumber(parseInt(e.target.value))}
                className="w-14 text-center border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative btn-primary flex items-center gap-2"
            >
              <ShoppingCart size={18} />
              Panier
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
            <button onClick={() => { logout(); navigate('/login') }} className="btn-secondary text-sm">
              Quitter
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tout
          </button>
          {categories.map((c: { id: number; name: string }) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === c.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((dish) => {
            const cartItem = items.find((i) => i.dish.id === dish.id)
            return (
              <div key={dish.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-36 bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                  {dish.imageUrl
                    ? <img src={dish.imageUrl} alt={dish.name} className="h-full w-full object-cover" />
                    : <span className="text-5xl">🍽️</span>
                  }
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{dish.name}</h3>
                  <p className="text-xs text-gray-400 mb-1">{dish.category.name}</p>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{dish.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary-600">{dish.price.toFixed(2)} MAD</span>
                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(dish.id, cartItem.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="font-bold w-4 text-center">{cartItem.quantity}</span>
                        <button onClick={() => addItem(dish)} className="w-7 h-7 rounded-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => addItem(dish)} className="flex items-center gap-1 text-sm bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors font-medium">
                        <Plus size={14} /> Ajouter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {showCart && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-sm h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-display text-xl font-bold">Mon panier</h2>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <p className="text-center text-gray-400 py-10">Votre panier est vide</p>
              ) : (
                items.map((item) => (
                  <div key={item.dish.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.dish.name}</p>
                      <p className="text-xs text-gray-500">{(item.dish.price * item.quantity).toFixed(2)} MAD</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.dish.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                        <Minus size={12} />
                      </button>
                      <span className="w-4 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => addItem(item.dish)} className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.dish.id)} className="text-gray-300 hover:text-red-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t">
                <div className="flex justify-between mb-4">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary-600 text-lg">{total().toFixed(2)} MAD</span>
                </div>
                <button
                  onClick={() => orderMutation.mutate()}
                  disabled={orderMutation.isPending}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {orderMutation.isPending ? 'Envoi...' : 'Commander'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { menuApi } from '../../lib/api'
import { Dish } from '../../types'

export default function DishesPage() {
  const qc = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Dish | null>(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '' })

  const { data: dishes = [], isLoading } = useQuery({
    queryKey: ['dishes'],
    queryFn: () => menuApi.getDishes().then((r) => r.data.data as Dish[]),
  })

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => menuApi.getCategories().then((r) => r.data.data),
  })

  const toggleMutation = useMutation({
    mutationFn: (id: number) => menuApi.toggleAvailable(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dishes'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => menuApi.deleteDish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dishes'] }),
  })

  const saveMutation = useMutation({
    mutationFn: (data: object) =>
      editing
        ? menuApi.updateDish(editing.id, data)
        : menuApi.createDish(data as FormData),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dishes'] })
      setShowModal(false)
      setEditing(null)
      setForm({ name: '', description: '', price: '', categoryId: '' })
    },
  })

  const openEdit = (dish: Dish) => {
    setEditing(dish)
    setForm({
      name: dish.name,
      description: dish.description ?? '',
      price: dish.price.toString(),
      categoryId: dish.category.id.toString(),
    })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveMutation.mutate({ ...form, price: parseFloat(form.price) })
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900">Menu</h1>
          <p className="text-gray-500 mt-1">{dishes.length} plats au total</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Ajouter un plat
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {dishes.map((dish) => (
            <div key={dish.id} className="card p-0 overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center">
                {dish.imageUrl ? (
                  <img src={dish.imageUrl} alt={dish.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl">🍽️</span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{dish.name}</h3>
                  <button onClick={() => toggleMutation.mutate(dish.id)} className="ml-2 text-gray-400 hover:text-primary-500 shrink-0">
                    {dish.available ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-2">{dish.category.name}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{dish.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary-600">{dish.price.toFixed(2)} MAD</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(dish)} className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit size={15} />
                    </button>
                    <button onClick={() => deleteMutation.mutate(dish.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="font-display text-xl font-bold mb-5">
              {editing ? 'Modifier le plat' : 'Nouveau plat'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (MAD)</label>
                  <input type="number" step="0.01" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
                    <option value="">Choisir...</option>
                    {categories.map((c: { id: number; name: string }) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setEditing(null) }} className="btn-secondary flex-1">
                  Annuler
                </button>
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary flex-1">
                  {saveMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

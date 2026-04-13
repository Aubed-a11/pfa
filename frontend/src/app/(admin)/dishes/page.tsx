"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { menuApi } from "@/lib/api";
import { Dish, Category } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  Plus, Pencil, Trash2, ToggleLeft, ToggleRight,
  Search, UtensilsCrossed, Star,
} from "lucide-react";
import { toast } from "sonner";
import { DishFormModal } from "@/components/menu/DishFormModal";

export default function MenuAdminPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [editDish, setEditDish] = useState<Dish | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: categoriesData } = useQuery<{ data: { data: Category[] } }>({
    queryKey: ["categories"],
    queryFn: menuApi.getCategories,
  });

  const { data: dishesData, isLoading } = useQuery<{ data: { data: Dish[] } }>({
    queryKey: ["dishes", search],
    queryFn: () => menuApi.getDishes(search || undefined),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => menuApi.toggleDish(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dishes"] });
      toast.success("Disponibilité mise à jour");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => menuApi.deleteDish(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dishes"] });
      toast.success("Plat supprimé");
    },
  });

  const categories: Category[] = categoriesData?.data?.data ?? [];
  const allDishes: Dish[] = dishesData?.data?.data ?? [];
  const dishes = selectedCategory
    ? allDishes.filter((d) => d.categoryId === selectedCategory)
    : allDishes;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Gestion du Menu</h1>
          <p className="text-stone-500 text-sm mt-1">{allDishes.length} plats au total</p>
        </div>
        <button
          onClick={() => { setEditDish(null); setShowForm(true); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} /> Nouveau plat
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-56">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            className="input pl-9"
            placeholder="Rechercher un plat…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              selectedCategory === null
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
            }`}
          >
            Tous
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                selectedCategory === cat.id
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-300"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau des plats */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : dishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <UtensilsCrossed size={40} className="mb-3" />
            <p className="font-medium text-stone-500">Aucun plat trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-5 py-3 text-left">Plat</th>
                  <th className="px-5 py-3 text-left">Catégorie</th>
                  <th className="px-5 py-3 text-right">Prix</th>
                  <th className="px-5 py-3 text-center">Vedette</th>
                  <th className="px-5 py-3 text-center">Disponible</th>
                  <th className="px-5 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {dishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {dish.imageUrl ? (
                            <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                          ) : (
                            <UtensilsCrossed size={16} className="text-stone-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-stone-900">{dish.name}</p>
                          <p className="text-stone-400 text-xs truncate max-w-48">{dish.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-stone-600">{dish.categoryName}</td>
                    <td className="px-5 py-3 text-right font-semibold text-stone-900">{formatPrice(dish.price)}</td>
                    <td className="px-5 py-3 text-center">
                      {dish.featured && <Star size={16} className="text-amber-500 mx-auto fill-amber-500" />}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button onClick={() => toggleMutation.mutate(dish.id)} className="mx-auto block">
                        {dish.available
                          ? <ToggleRight size={22} className="text-green-500" />
                          : <ToggleLeft size={22} className="text-stone-300" />}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setEditDish(dish); setShowForm(true); }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Supprimer "${dish.name}" ?`)) deleteMutation.mutate(dish.id);
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal formulaire */}
      {showForm && (
        <DishFormModal
          dish={editDish}
          categories={categories}
          onClose={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            qc.invalidateQueries({ queryKey: ["dishes"] });
          }}
        />
      )}
    </div>
  );
}

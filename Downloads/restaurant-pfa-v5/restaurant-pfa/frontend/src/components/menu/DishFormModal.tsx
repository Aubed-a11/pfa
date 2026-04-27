"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { menuApi } from "@/lib/api";
import { Dish, Category } from "@/types";
import { toast } from "sonner";
import { X } from "lucide-react";

const schema = z.object({
  name:            z.string().min(2, "Minimum 2 caractères"),
  description:     z.string().optional(),
  price:           z.coerce.number().min(0.01, "Prix invalide"),
  imageUrl:        z.string().optional(),
  available:       z.boolean(),
  featured:        z.boolean(),
  prepTimeMinutes: z.coerce.number().optional(),
  allergens:       z.string().optional(),
  categoryId:      z.coerce.number().min(1, "Sélectionnez une catégorie"),
});
type FormData = z.infer<typeof schema>;

interface Props {
  dish: Dish | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export function DishFormModal({ dish, categories, onClose, onSuccess }: Props) {
  const isEdit = !!dish;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", description: "", price: 0, imageUrl: "",
      available: true, featured: false, prepTimeMinutes: 15,
      allergens: "", categoryId: categories[0]?.id ?? 0,
    },
  });

  useEffect(() => {
    if (dish) reset({ ...dish, price: dish.price });
  }, [dish, reset]);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      isEdit ? menuApi.updateDish(dish!.id, data) : menuApi.createDish(data),
    onSuccess: () => {
      toast.success(isEdit ? "Plat mis à jour" : "Plat créé");
      onSuccess();
    },
    onError: () => toast.error("Erreur lors de la sauvegarde"),
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900 text-lg">
            {isEdit ? "Modifier le plat" : "Nouveau plat"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nom */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Nom du plat *</label>
              <input {...register("name")} className="input" placeholder="Ex : Tajine poulet" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
              <textarea {...register("description")} className="input resize-none" rows={2} placeholder="Description du plat…" />
            </div>

            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Prix (MAD) *</label>
              <input type="number" step="0.01" {...register("price")} className="input" placeholder="0.00" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
            </div>

            {/* Temps préparation */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Temps prépa (min)</label>
              <input type="number" {...register("prepTimeMinutes")} className="input" placeholder="15" />
            </div>

            {/* Catégorie */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Catégorie *</label>
              <select {...register("categoryId")} className="input">
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
            </div>

            {/* Image URL */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">URL de l'image</label>
              <input {...register("imageUrl")} className="input" placeholder="https://…" />
            </div>

            {/* Allergènes */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-stone-700 mb-1">Allergènes</label>
              <input {...register("allergens")} className="input" placeholder="Gluten, Lactose…" />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3">
              <input type="checkbox" id="available" {...register("available")} className="w-4 h-4 accent-brand-600" />
              <label htmlFor="available" className="text-sm text-stone-700">Disponible</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" {...register("featured")} className="w-4 h-4 accent-brand-600" />
              <label htmlFor="featured" className="text-sm text-stone-700">Plat vedette</label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Annuler</button>
            <button type="submit" disabled={mutation.isPending} className="btn-primary flex-1">
              {mutation.isPending ? "Sauvegarde…" : isEdit ? "Mettre à jour" : "Créer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

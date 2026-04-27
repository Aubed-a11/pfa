"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { AuthResponse } from "@/types";
import { Eye, EyeOff, UtensilsCrossed } from "lucide-react";

const schema = z.object({
  email:    z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "admin@restaurant.ma", password: "admin123" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.login(data.email, data.password);
      const body: AuthResponse = res.data.data;
      setAuth(body.user, body.accessToken);
      toast.success(`Bienvenue, ${body.user.name} !`);
      if (body.user.role === "ADMIN")       router.replace("/dashboard");
      else if (body.user.role === "STAFF")  router.replace("/kanban");
      else                                   router.replace("/order");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Identifiants incorrects";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-brand-600 text-white p-3 rounded-xl mb-3">
            <UtensilsCrossed size={28} />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">RestaurantPFA</h1>
          <p className="text-stone-500 text-sm mt-1">Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="input"
              placeholder="admin@restaurant.ma"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Mot de passe</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                {...register("password")}
                className="input pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Connexion…
              </span>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* Comptes de démo */}
        <div className="mt-6 p-4 bg-stone-50 rounded-xl border border-stone-100">
          <p className="text-xs font-medium text-stone-500 mb-2">Comptes de démonstration :</p>
          <div className="space-y-1 text-xs text-stone-600">
            <p><span className="font-medium">Admin :</span> admin@restaurant.ma / admin123</p>
            <p><span className="font-medium">Cuisine :</span> chef@restaurant.ma / chef123</p>
            <p><span className="font-medium">Client :</span> client@restaurant.ma / client123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, UtensilsCrossed, ClipboardList,
  Calculator, Users, BarChart3, ChefHat, LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const adminNav = [
  { href: "/dashboard",  label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dishes",       label: "Menu",             icon: UtensilsCrossed },
  { href: "/orders",     label: "Commandes",        icon: ClipboardList },
  { href: "/accounting", label: "Comptabilité",     icon: Calculator },
  { href: "/users",      label: "Utilisateurs",     icon: Users },
  { href: "/stats",      label: "Statistiques",     icon: BarChart3 },
  { href: "/kanban",     label: "Cuisine",          icon: ChefHat },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Déconnecté");
    router.replace("/login");
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-stone-900 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-stone-700">
        <div className="bg-brand-600 p-2 rounded-lg">
          <UtensilsCrossed size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-none">RestaurantPFA</p>
          <p className="text-stone-400 text-xs mt-0.5">Gestion</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {adminNav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-brand-600 text-white"
                  : "text-stone-400 hover:bg-stone-800 hover:text-white"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t border-stone-700">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-stone-400 text-xs truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

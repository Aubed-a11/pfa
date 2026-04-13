"use client";
import { useState } from "react";
import { Users, Shield, ChefHat, UserRound, Search } from "lucide-react";

// Page placeholder — à connecter à GET /admin/users (à ajouter au backend)
const DEMO_USERS = [
  { id: 1, name: "Admin Restaurant", email: "admin@restaurant.ma", role: "ADMIN",  active: true,  phone: "0600000001" },
  { id: 2, name: "Chef Cuisine",     email: "chef@restaurant.ma",  role: "STAFF",  active: true,  phone: "0600000002" },
  { id: 3, name: "Client Test",      email: "client@restaurant.ma",role: "CLIENT", active: true,  phone: "0600000003" },
];

const ROLE_LABELS: Record<string, string> = { ADMIN: "Admin", STAFF: "Personnel", CLIENT: "Client" };
const ROLE_ICONS: Record<string, React.ReactNode> = {
  ADMIN:  <Shield size={14} />,
  STAFF:  <ChefHat size={14} />,
  CLIENT: <UserRound size={14} />,
};
const ROLE_COLORS: Record<string, string> = {
  ADMIN:  "bg-purple-100 text-purple-700",
  STAFF:  "bg-amber-100 text-amber-700",
  CLIENT: "bg-blue-100 text-blue-700",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");

  const filtered = DEMO_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Utilisateurs</h1>
          <p className="text-stone-500 text-sm mt-1">{DEMO_USERS.length} comptes enregistrés</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          className="input pl-9"
          placeholder="Rechercher un utilisateur…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-5 py-3 text-left">Utilisateur</th>
              <th className="px-5 py-3 text-left">Email</th>
              <th className="px-5 py-3 text-left">Téléphone</th>
              <th className="px-5 py-3 text-left">Rôle</th>
              <th className="px-5 py-3 text-left">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-semibold text-sm flex-shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <span className="font-medium text-stone-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-stone-600">{u.email}</td>
                <td className="px-5 py-3 text-stone-500">{u.phone}</td>
                <td className="px-5 py-3">
                  <span className={`badge flex items-center gap-1 w-fit ${ROLE_COLORS[u.role]}`}>
                    {ROLE_ICONS[u.role]} {ROLE_LABELS[u.role]}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={`badge ${u.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {u.active ? "Actif" : "Suspendu"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

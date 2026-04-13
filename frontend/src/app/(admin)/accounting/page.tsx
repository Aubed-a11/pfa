"use client";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/lib/api";
import { DashboardStats } from "@/types";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, TrendingDown, Calculator, FileText } from "lucide-react";

export default function AccountingPage() {
  const { data: statsData } = useQuery<{ data: { data: DashboardStats } }>({
    queryKey: ["stats", "dashboard"],
    queryFn: statsApi.getDashboard,
  });

  const stats: DashboardStats = statsData?.data?.data ?? {
    revenueToday: 0, revenueMonth: 0, ordersToday: 0, totalUsers: 0,
  };

  // TVA 20%
  const tva = stats.revenueMonth * 0.2;
  const ht  = stats.revenueMonth - tva;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Comptabilité</h1>
        <p className="text-stone-500 text-sm mt-1">Suivi financier du restaurant</p>
      </div>

      {/* Résumé financier */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-brand-100 rounded-lg"><TrendingUp size={18} className="text-brand-600" /></div>
            <p className="text-stone-500 text-sm font-medium">CA mensuel TTC</p>
          </div>
          <p className="text-2xl font-bold text-stone-900">{formatPrice(stats.revenueMonth)}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-100 rounded-lg"><Calculator size={18} className="text-green-600" /></div>
            <p className="text-stone-500 text-sm font-medium">CA mensuel HT</p>
          </div>
          <p className="text-2xl font-bold text-stone-900">{formatPrice(ht)}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-amber-100 rounded-lg"><FileText size={18} className="text-amber-600" /></div>
            <p className="text-stone-500 text-sm font-medium">TVA collectée (20%)</p>
          </div>
          <p className="text-2xl font-bold text-stone-900">{formatPrice(tva)}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg"><TrendingUp size={18} className="text-blue-600" /></div>
            <p className="text-stone-500 text-sm font-medium">CA aujourd'hui</p>
          </div>
          <p className="text-2xl font-bold text-stone-900">{formatPrice(stats.revenueToday)}</p>
        </div>
      </div>

      {/* Résumé mensuel */}
      <div className="card p-6">
        <h2 className="font-semibold text-stone-900 mb-5 flex items-center gap-2">
          <Calculator size={18} className="text-brand-600" />
          Résumé du mois en cours
        </h2>
        <div className="space-y-3">
          {[
            { label: "Chiffre d'affaires TTC",  value: stats.revenueMonth, color: "text-stone-900"   },
            { label: "TVA collectée (20%)",      value: -tva,               color: "text-amber-600"   },
            { label: "Chiffre d'affaires HT",    value: ht,                 color: "text-green-600",  bold: true },
          ].map(({ label, value, color, bold }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
              <span className="text-stone-600 text-sm">{label}</span>
              <span className={`font-${bold ? "bold text-base" : "medium text-sm"} ${color}`}>
                {value < 0 ? "- " : ""}{formatPrice(Math.abs(value))}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
          <p className="font-medium mb-1">Note</p>
          <p>Le module comptabilité complet (dépenses, export Excel/PDF, bilan) sera disponible en Phase 2. Les données ci-dessus proviennent des commandes payées enregistrées.</p>
        </div>
      </div>
    </div>
  );
}

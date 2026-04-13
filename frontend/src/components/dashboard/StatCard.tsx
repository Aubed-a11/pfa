import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color?: "orange" | "green" | "blue" | "purple";
}

const colorMap = {
  orange: { bg: "bg-brand-50",  icon: "bg-brand-100 text-brand-600" },
  green:  { bg: "bg-green-50",  icon: "bg-green-100 text-green-600" },
  blue:   { bg: "bg-blue-50",   icon: "bg-blue-100 text-blue-600"   },
  purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-600" },
};

export function StatCard({ title, value, subtitle, icon: Icon, color = "orange" }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={cn("card p-5 flex items-center gap-4", c.bg)}>
      <div className={cn("p-3 rounded-xl flex-shrink-0", c.icon)}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-stone-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-stone-900 mt-0.5">{value}</p>
        {subtitle && <p className="text-stone-400 text-xs mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

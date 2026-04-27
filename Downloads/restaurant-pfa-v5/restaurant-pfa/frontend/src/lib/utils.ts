import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("fr-MA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateStr));
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  RECEIVED:  "Reçue",
  PREPARING: "En préparation",
  READY:     "Prête",
  SERVED:    "Servie",
  CANCELLED: "Annulée",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  RECEIVED:  "bg-blue-100 text-blue-800",
  PREPARING: "bg-amber-100 text-amber-800",
  READY:     "bg-green-100 text-green-800",
  SERVED:    "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-700",
};

export const ORDER_TYPE_LABELS: Record<string, string> = {
  DINE_IN:  "Sur place",
  TAKEAWAY: "À emporter",
  DELIVERY: "Livraison",
};

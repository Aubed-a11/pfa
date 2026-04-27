// ── Auth ──────────────────────────────────────────────────
export type Role = "CLIENT" | "STAFF" | "ADMIN";

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserInfo;
}

// ── Menu ──────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
  displayOrder: number;
  active: boolean;
  dishCount: number;
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  featured: boolean;
  prepTimeMinutes?: number;
  allergens?: string;
  categoryId: number;
  categoryName: string;
  createdAt: string;
}

export interface CategoryWithDishes extends Category {
  dishes: Dish[];
}

// ── Orders ────────────────────────────────────────────────
export type OrderStatus = "RECEIVED" | "PREPARING" | "READY" | "SERVED" | "CANCELLED";
export type OrderType   = "DINE_IN" | "TAKEAWAY" | "DELIVERY";

export interface OrderItem {
  dishId: number;
  dishName: string;
  dishImageUrl?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  type: OrderType;
  tableNumber?: string;
  deliveryAddress?: string;
  notes?: string;
  totalAmount: number;
  paid: boolean;
  estimatedMinutes?: number;
  items: OrderItem[];
  customerName: string;
  createdAt: string;
  updatedAt: string;
}

// ── Stats ─────────────────────────────────────────────────
export interface DashboardStats {
  revenueToday: number;
  revenueMonth: number;
  ordersToday: number;
  totalUsers: number;
}

// ── API Wrapper ───────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  timestamp: string;
}

// ── Cart ──────────────────────────────────────────────────
export interface CartItem {
  dish: Dish;
  quantity: number;
  specialInstructions?: string;
}

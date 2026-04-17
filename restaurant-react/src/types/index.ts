export type Role = 'ADMIN' | 'CHEF' | 'CLIENT'

export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: Role
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  user: User
}

export interface Category {
  id: number
  name: string
  description?: string
}

export interface Dish {
  id: number
  name: string
  description?: string
  price: number
  imageUrl?: string
  available: boolean
  category: Category
}

export type OrderStatus = 'PENDING' | 'IN_PREPARATION' | 'READY' | 'DELIVERED' | 'PAID' | 'CANCELLED'

export interface OrderItem {
  id: number
  dish: Dish
  quantity: number
  unitPrice: number
}

export interface Order {
  id: number
  tableNumber: number
  status: OrderStatus
  totalAmount: number
  createdAt: string
  updatedAt: string
  user: User
  items: OrderItem[]
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface Stats {
  totalRevenue: number
  totalOrders: number
  avgOrderValue: number
  popularDishes: { dishName: string; count: number }[]
  revenueByDay: { date: string; revenue: number }[]
}

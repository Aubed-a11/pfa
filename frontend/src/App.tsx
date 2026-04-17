import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import LoginPage from './pages/auth/LoginPage'
import AdminLayout from './components/layout/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import DishesPage from './pages/admin/DishesPage'
import OrdersPage from './pages/admin/OrdersPage'
import StatsPage from './pages/admin/StatsPage'
import UsersPage from './pages/admin/UsersPage'
import KanbanPage from './pages/kitchen/KanbanPage'
import MenuPage from './pages/client/MenuPage'

function RequireAuth({ children, roles }: { children: JSX.Element; roles?: string[] }) {
  const { user, isAuthenticated } = useAuthStore()
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  const { user } = useAuthStore()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <RequireAuth roles={['ADMIN']}>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="dishes" element={<DishesPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>

        <Route
          path="/kitchen"
          element={
            <RequireAuth roles={['CHEF', 'ADMIN']}>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="kanban" element={<KanbanPage />} />
        </Route>

        <Route
          path="/menu"
          element={
            <RequireAuth roles={['CLIENT', 'ADMIN']}>
              <MenuPage />
            </RequireAuth>
          }
        />

        <Route
          path="/"
          element={
            user
              ? user.role === 'ADMIN'
                ? <Navigate to="/admin/dashboard" replace />
                : user.role === 'CHEF'
                ? <Navigate to="/kitchen/kanban" replace />
                : <Navigate to="/menu" replace />
              : <Navigate to="/login" replace />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

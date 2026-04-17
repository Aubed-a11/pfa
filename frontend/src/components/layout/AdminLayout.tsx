import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useOrdersWebSocket } from '../../hooks/useOrders'

export default function AdminLayout() {
  useOrdersWebSocket()
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

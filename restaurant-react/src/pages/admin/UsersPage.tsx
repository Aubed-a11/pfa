import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { usersApi } from '../../lib/api'
import { User, Role } from '../../types'
import { useAuthStore } from '../../store/authStore'

const roleBadge: Record<Role, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  CHEF: 'bg-blue-100 text-blue-700',
  CLIENT: 'bg-gray-100 text-gray-600',
}

export default function UsersPage() {
  const qc = useQueryClient()
  const { user: me } = useAuthStore()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll().then((r) => r.data.data as User[]),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => usersApi.updateRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">Utilisateurs</h1>
        <p className="text-gray-500 mt-1">{users.length} utilisateurs enregistrés</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Chargement...</div>
      ) : (
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-6 text-gray-500 font-medium">Nom</th>
                <th className="text-left py-3 px-6 text-gray-500 font-medium">Email</th>
                <th className="text-left py-3 px-6 text-gray-500 font-medium">Rôle</th>
                <th className="text-left py-3 px-6 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium">{u.name}</td>
                  <td className="py-4 px-6 text-gray-500">{u.email}</td>
                  <td className="py-4 px-6">
                    <span className={`badge ${roleBadge[u.role]}`}>{u.role}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <select
                        value={u.role}
                        onChange={(e) => roleMutation.mutate({ id: u.id, role: e.target.value })}
                        disabled={u.id === me?.id}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="CLIENT">CLIENT</option>
                        <option value="CHEF">CHEF</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      {u.id !== me?.id && (
                        <button
                          onClick={() => deleteMutation.mutate(u.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

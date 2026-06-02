'use client'
import React, { useState, useEffect } from 'react'
import { Search, UserCheck, UserX, Shield, User as UserIcon } from 'lucide-react'
import { userAPI } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { toast } from 'sonner'
import { type User } from '@/types'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchUsers = (q = '') => {
    setLoading(true)
    userAPI.getAll({ search: q, limit: 100 })
      .then((res) => setUsers(res.data.data?.users || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const toggleStatus = async (user: User) => {
    setUpdating(user._id)
    try {
      const res = await userAPI.updateStatus(user._id, !user.isActive)
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, isActive: res.data.data.isActive } : u))
      toast.success(`User ${res.data.data.isActive ? 'activated' : 'deactivated'}`)
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setUpdating(null)
    }
  }

  const toggleRole = async (user: User) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return
    setUpdating(user._id)
    try {
      const res = await userAPI.updateRole(user._id, newRole)
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, role: res.data.data.role } : u))
      toast.success('Role updated')
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500 mt-1">{users.length} registered users</p>
        </div>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-600 text-sm bg-white"
        />
      </div>

      {loading ? (
        <LoadingSpinner fullPage />
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Joined</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">No users found</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-primary-700 font-semibold text-sm shrink-0">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{u.createdAt ? formatDate(u.createdAt) : ''}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleRole(u)}
                          disabled={updating === u._id}
                          title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                        >
                          {u.role === 'admin' ? <UserIcon className="h-4 w-4 text-gray-600" /> : <Shield className="h-4 w-4 text-purple-600" />}
                        </button>
                        <button
                          onClick={() => toggleStatus(u)}
                          disabled={updating === u._id}
                          title={u.isActive ? 'Deactivate' : 'Activate'}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                        >
                          {u.isActive ? <UserX className="h-4 w-4 text-red-500" /> : <UserCheck className="h-4 w-4 text-green-600" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

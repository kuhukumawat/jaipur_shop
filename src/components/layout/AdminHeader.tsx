'use client'
import React, { useState } from 'react'
import { LogOut, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export function AdminHeader() {
  const { user, logout } = useAuthStore()
  const [open, setOpen] = useState(false)

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-gray-200 bg-white shadow-lg py-1">
              <div className="px-3 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setOpen(false)
                  logout()
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}

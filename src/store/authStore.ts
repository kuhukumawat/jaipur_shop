'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { type User } from '@/types'

interface AuthState {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAdmin: false,
      login: (user, token) => {
        localStorage.setItem('token', token)
        document.cookie = `auth-token=${token}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`
        document.cookie = `user-role=${user.role}; path=/; max-age=${7 * 24 * 3600}; SameSite=Lax`
        set({ user, token, isAdmin: user.role === 'admin' })
      },
      logout: () => {
        localStorage.removeItem('token')
        document.cookie = 'auth-token=; Max-Age=0; path=/'
        document.cookie = 'user-role=; Max-Age=0; path=/'
        set({ user: null, token: null, isAdmin: false })
        window.location.href = '/login'
      },
      setUser: (user) => set({ user, isAdmin: user.role === 'admin' }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isAdmin: state.isAdmin }),
    }
  )
)

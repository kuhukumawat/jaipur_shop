'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

export default function Home() {
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin')
    } else {
      router.replace('/products')
    }
  }, [user, router])

  return <LoadingSpinner fullPage />
}

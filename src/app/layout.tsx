import React from 'react'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'Jaipur Shop',
  description: 'Your trusted shopping destination',
  icons: {
    icon: '/logo.png',
  },
  site_name: 'Jaipur Shop',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}

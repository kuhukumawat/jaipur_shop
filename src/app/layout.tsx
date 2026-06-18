import React from 'react';
import './globals.css';
import { Toaster } from 'sonner';


export const metadata = {
  title: 'CARN‑X – Premium Fresh Cuts',
  description: 'Handpicked, expertly butchered meats sourced from trusted farms. Farm fresh, delivered daily.',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">

      <body className="min-h-screen bg-background text-text antialiased">
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: '#18181b',
              border: '1px solid #3f3f46',
              color: '#f4f4f5',
            },
          }}
        />
      </body>
    </html>
  );
}


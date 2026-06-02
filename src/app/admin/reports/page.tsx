'use client'
import React, { useState } from 'react'
import { FileSpreadsheet, Download, Package, ShoppingCart } from 'lucide-react'
import { reportAPI } from '@/lib/api'
import { toast } from 'sonner'

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  onDownload: () => void;
  loading?: boolean;
}

function ReportCard({ title, description, icon: Icon, color, onDownload, loading }: ReportCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-card">
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          <button
            onClick={onDownload}
            disabled={loading}
            className="mt-4 flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {loading ? 'Generating...' : 'Download Excel'}
          </button>
        </div>
      </div>
    </div>
  )
}

const downloadBlob = (data: any, filename: string) => {
  const url = window.URL.createObjectURL(new Blob([data]))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  window.URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const [loading, setLoading] = useState<Record<string, boolean>>({})

  const handleDownload = async (key: string, apiFn: () => Promise<any>, filename: string) => {
    setLoading((prev) => ({ ...prev, [key]: true }))
    try {
      const res = await apiFn()
      downloadBlob(res.data, filename)
      toast.success(`${filename} downloaded`)
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }))
    }
  }

  const date = new Date().toISOString().slice(0, 10)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Download Excel reports for your business data</p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <ReportCard
          title="Inventory Report"
          description="Complete stock overview with current quantities, cost prices, selling prices, and stock values for all products."
          icon={Package}
          color="bg-blue-600"
          loading={loading.inventory}
          onDownload={() => handleDownload('inventory', reportAPI.downloadInventoryExcel, `inventory-report-${date}.xlsx`)}
        />
        <ReportCard
          title="Orders Report"
          description="Full orders history with customer details, order totals, payment status, and order status."
          icon={ShoppingCart}
          color="bg-green-600"
          loading={loading.orders}
          onDownload={() => handleDownload('orders', () => reportAPI.downloadOrdersExcel(), `orders-report-${date}.xlsx`)}
        />
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">About Reports</p>
            <p className="mt-1 text-sm text-blue-700">
              Reports are generated in real-time from your current database. Excel files include formatted tables with color coding, auto-sized columns, and summary rows for easy analysis.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

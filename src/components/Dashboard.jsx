import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  DollarSign, 
  FileText, 
  Users, 
  TrendingUp, 
  AlertCircle,
  Plus,
  Eye
} from 'lucide-react'

export default function Dashboard() {
  const { user, currentBusiness, businesses, switchBusiness } = useAuth()
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    outstandingInvoices: 0,
    overdueInvoices: 0,
    recentTransactions: [],
    loading: true
  })

  useEffect(() => {
    if (currentBusiness) {
      loadDashboardData()
    }
  }, [currentBusiness])

  const loadDashboardData = async () => {
    if (!currentBusiness) return

    try {
      setDashboardData(prev => ({ ...prev, loading: true }))

      // Load recent invoices
      const { data: invoices, error: invoicesError } = await supabase
        .from('invoices')
        .select(`
          id,
          invoice_number,
          total_amount,
          balance_due,
          status,
          invoice_date,
          due_date,
          contacts (
            company_name,
            first_name,
            last_name
          )
        `)
        .eq('business_id', currentBusiness.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (invoicesError) throw invoicesError

      // Calculate metrics
      const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0
      const outstandingInvoices = invoices?.reduce((sum, inv) => sum + (inv.balance_due || 0), 0) || 0
      const overdueInvoices = invoices?.filter(inv => 
        inv.status !== 'paid' && new Date(inv.due_date) < new Date()
      ).length || 0

      setDashboardData({
        totalRevenue,
        totalExpenses: 0, // Will be calculated from bills
        outstandingInvoices,
        overdueInvoices,
        recentTransactions: invoices || [],
        loading: false
      })

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setDashboardData(prev => ({ ...prev, loading: false }))
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentBusiness?.currency || 'USD'
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'sent': return 'bg-blue-100 text-blue-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!currentBusiness) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No business selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a business to view the dashboard
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Business Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Welcome back! Here's what's happening with {currentBusiness.name}.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={currentBusiness.id}
            onChange={(e) => {
              const business = businesses.find(b => b.id === e.target.value)
              if (business) switchBusiness(business)
            }}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From {dashboardData.recentTransactions.length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.outstandingInvoices)}</div>
            <p className="text-xs text-muted-foreground">
              Amount due from customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.overdueInvoices}</div>
            <p className="text-xs text-muted-foreground">
              Invoices past due date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.length}</div>
            <p className="text-xs text-muted-foreground">
              Connected business entities
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>
                Latest invoices for {currentBusiness.name}
              </CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dashboardData.loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : dashboardData.recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first invoice
              </p>
              <div className="mt-6">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Invoice
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {dashboardData.recentTransactions.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {invoice.contacts?.company_name || 
                         `${invoice.contacts?.first_name || ''} ${invoice.contacts?.last_name || ''}`.trim() ||
                         'Unknown Customer'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(invoice.total_amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Due {formatDate(invoice.due_date)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

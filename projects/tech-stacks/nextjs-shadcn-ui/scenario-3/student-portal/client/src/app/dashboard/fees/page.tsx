import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { tuitionFees } from "@/lib/mockData"
import { DollarSign, CreditCard, CheckCircle, Clock, AlertCircle, Download } from "lucide-react"

export default function FeesPage() {
  const paidFees = tuitionFees.filter((f) => f.status === "paid")
  const pendingFees = tuitionFees.filter((f) => f.status === "pending")
  const overdueFees = tuitionFees.filter((f) => f.status === "overdue")

  const totalPaid = paidFees.reduce((sum, f) => sum + f.amount, 0)
  const totalPending = pendingFees.reduce((sum, f) => sum + f.amount, 0)
  const totalOverdue = overdueFees.reduce((sum, f) => sum + f.amount, 0)
  const grandTotal = totalPaid + totalPending + totalOverdue

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Paid</Badge>
      case "pending":
        return <Badge variant="warning" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</Badge>
      case "overdue":
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tuition Fees</h1>
        <p className="text-gray-600">View and manage your tuition and other fees</p>
      </div>

      {/* Fee Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{grandTotal.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Academic Year 2025-2026</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₱{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{paidFees.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₱{totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{pendingFees.length} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₱{totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{overdueFees.length} overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
          <CardDescription>Breakdown of your tuition payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <p className="font-medium">Total Tuition & Fees</p>
                <p className="text-sm text-gray-500">Academic Year 2025-2026</p>
              </div>
              <p className="text-xl font-bold">₱{grandTotal.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div>
                <p className="font-medium text-green-800">Amount Paid</p>
                <p className="text-sm text-green-600">{paidFees.length} payments</p>
              </div>
              <p className="text-xl font-bold text-green-700">-₱{totalPaid.toLocaleString()}</p>
            </div>
            <div className="flex justify-between items-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div>
                <p className="font-medium text-orange-800">Balance</p>
                <p className="text-sm text-orange-600">{pendingFees.length} pending payments</p>
              </div>
              <p className="text-xl font-bold text-orange-700">₱{totalPending.toLocaleString()}</p>
            </div>
            
            {totalPending > 0 && (
              <Button className="w-full mt-4">
                <CreditCard className="w-4 h-4 mr-2" />
                Pay Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fee Details Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Fee Details</CardTitle>
            <CardDescription>Complete list of all charges</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tuitionFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.description}</TableCell>
                  <TableCell>{fee.semester}</TableCell>
                  <TableCell>{formatDate(fee.dueDate)}</TableCell>
                  <TableCell>₱{fee.amount.toLocaleString()}</TableCell>
                  <TableCell>{getStatusBadge(fee.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { currentStudent, grades, currentStanding, schedule, tuitionFees } from "@/lib/mockData"
import { BookOpen, Calendar, DollarSign, Award, TrendingUp, Clock } from "lucide-react"

export default function DashboardPage() {
  const recentGrades = grades.slice(0, 3)
  const pendingFees = tuitionFees.filter(f => f.status === "pending")
  const totalPaid = tuitionFees
    .filter(f => f.status === "paid")
    .reduce((sum, f) => sum + f.amount, 0)
  const totalPending = tuitionFees
    .filter(f => f.status === "pending")
    .reduce((sum, f) => sum + f.amount, 0)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {currentStudent.name.split(" ")[0]}!
        </h1>
        <p className="text-gray-600">
          {currentStudent.program} • {currentStudent.yearLevel}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{currentStanding.gpa.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {currentStanding.academicYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Units</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStanding.totalUnits}</div>
            <p className="text-xs text-muted-foreground">
              {currentStanding.semester}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Today</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{schedule.length}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₱{totalPending.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingFees.length} pending
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recent Grades
            </CardTitle>
            <CardDescription>Your latest grade submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGrades.map((grade) => (
                <div
                  key={grade.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{grade.courseName}</p>
                    <p className="text-sm text-gray-500">{grade.courseCode}</p>
                  </div>
                  <Badge
                    variant={
                      grade.grade.startsWith("A")
                        ? "success"
                        : grade.grade.startsWith("B")
                        ? "warning"
                        : "destructive"
                    }
                    className="text-sm"
                  >
                    {grade.grade}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tuition Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tuition Summary
            </CardTitle>
            <CardDescription>Current semester fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
                <div>
                  <p className="font-medium text-green-900">Paid</p>
                  <p className="text-sm text-green-700">{tuitionFees.filter(f => f.status === "paid").length} transactions</p>
                </div>
                <p className="text-lg font-bold text-green-700">
                  ₱{totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50">
                <div>
                  <p className="font-medium text-orange-900">Pending</p>
                  <p className="text-sm text-orange-700">{pendingFees.length} pending</p>
                </div>
                <p className="text-lg font-bold text-orange-700">
                  ₱{totalPending.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Class Schedule
            </CardTitle>
            <CardDescription>Your classes for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schedule.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-gray-50"
                >
                  <p className="font-medium text-gray-900">{item.courseName}</p>
                  <p className="text-sm text-gray-500">{item.time} • {item.room}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Academic Standing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Academic Standing
            </CardTitle>
            <CardDescription>Current academic status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white">Status</span>
                <Badge variant="success" className="capitalize">
                  {currentStanding.academicStatus}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white">GPA</span>
                <span className="font-medium">{currentStanding.gpa.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white">Earned Credits</span>
                <span className="font-medium">{currentStanding.earnedCredits}/{currentStanding.totalCredits}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white">Total Units</span>
                <span className="font-medium">{currentStanding.totalUnits}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

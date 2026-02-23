import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { currentStanding, grades, currentStudent } from "@/lib/mockData"
import { Award, TrendingUp, BookOpen, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export default function StandingPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Good Standing</Badge>
      case "warning":
        return <Badge variant="warning" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Warning</Badge>
      case "probation":
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Probation</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getGPAStatus = (gpa: number) => {
    if (gpa >= 3.5) return { label: "Dean's List", color: "text-purple-600" }
    if (gpa >= 3.0) return { label: "Good", color: "text-green-600" }
    if (gpa >= 2.0) return { label: "Satisfactory", color: "text-blue-600" }
    if (gpa >= 1.0) return { label: "Poor", color: "text-orange-600" }
    return { label: "Critical", color: "text-red-600" }
  }

  const gpaStatus = getGPAStatus(currentStanding.gpa)
  const creditsNeeded = currentStanding.totalCredits - currentStanding.earnedCredits
  const completionRate = (currentStanding.earnedCredits / currentStanding.totalCredits) * 100

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Academic Standing</h1>
        <p className="text-gray-600">View your current academic progress and status</p>
      </div>

      {/* Main Status Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-black">Current Academic Status</CardTitle>
            {getStatusBadge(currentStanding.academicStatus)}
          </div>
          <CardDescription>
            {currentStanding.semester} • {currentStanding.academicYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-3xl font-bold text-blue-600">{currentStanding.gpa.toFixed(2)}</p>
              <p className="text-sm text-black">Current GPA</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <Award className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className={`text-3xl font-bold ${gpaStatus.color}`}>{gpaStatus.label}</p>
              <p className="text-sm text-black">GPA Status</p>
            </div>
            <div className="text-center p-4 bg-white/50 rounded-lg">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-3xl font-bold text-green-600">{currentStanding.totalUnits}</p>
              <p className="text-sm text-black">Current Units</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earned Credits</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStanding.earnedCredits}</div>
            <p className="text-xs text-muted-foreground">of {currentStanding.totalCredits} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Needed</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{creditsNeeded}</div>
            <p className="text-xs text-muted-foreground">to graduate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">credits completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Units</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStanding.totalUnits}</div>
            <p className="text-xs text-muted-foreground">this semester</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Degree Progress</CardTitle>
          <CardDescription>Your progress towards completing your degree</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{completionRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3 mt-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <p className="text-2xl font-bold text-green-700">{currentStanding.earnedCredits} credits</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-blue-700">{currentStanding.totalUnits} units</p>
              </div>
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-600 font-medium">Remaining</p>
                <p className="text-2xl font-bold text-orange-700">{creditsNeeded} credits</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Info */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
          <CardDescription>Your academic profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="font-medium">12-346-78</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{currentStudent.name}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Program</p>
              <p className="font-medium">{currentStudent.program}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Year Level</p>
              <p className="font-medium">{currentStudent.yearLevel}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

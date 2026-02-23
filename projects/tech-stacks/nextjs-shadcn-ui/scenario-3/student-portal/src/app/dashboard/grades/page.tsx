"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { grades } from "@/lib/mockData"
import { BookOpen, Award, TrendingUp } from "lucide-react"

export default function GradesPage() {
  const [selectedSemester, setSelectedSemester] = useState("all")

  const currentSemGrades = grades.filter(
    (g) => g.semester === "1st Semester" && g.academicYear === "2025-2026"
  )
  const previousSemGrades = grades.filter(
    (g) => g.semester === "2nd Semester" && g.academicYear === "2024-2025"
  )

  const calculateGPA = (gradeList: typeof grades) => {
    const gradePoints: { [key: string]: number } = {
      "A": 4.0, "A-": 3.7, "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7, "D+": 1.3, "D": 1.0, "F": 0.0
    }
    
    let totalPoints = 0
    let totalUnits = 0
    
    gradeList.forEach((g) => {
      const points = gradePoints[g.grade] || 0
      totalPoints += points * g.units
      totalUnits += g.units
    })
    
    return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : "0.00"
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "success"
    if (grade.startsWith("B")) return "warning"
    if (grade.startsWith("C")) return "secondary"
    return "destructive"
  }

  const getAllTimeGPA = () => {
    return calculateGPA(grades)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
        <p className="text-gray-600">View your academic grades and performance</p>
      </div>

      {/* GPA Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {calculateGPA(currentSemGrades)}
            </div>
            <p className="text-xs text-muted-foreground">1st Sem 2025-2026</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previous GPA</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {calculateGPA(previousSemGrades)}
            </div>
            <p className="text-xs text-muted-foreground">2nd Sem 2024-2025</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cumulative GPA</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {getAllTimeGPA()}
            </div>
            <p className="text-xs text-muted-foreground">All semesters</p>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Course Grades</CardTitle>
          <CardDescription>Detailed breakdown of your grades by semester</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="current" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="current">Current Semester</TabsTrigger>
              <TabsTrigger value="all">All Semesters</TabsTrigger>
            </TabsList>
            
            <TabsContent value="current" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Semester</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSemGrades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium">{grade.courseCode}</TableCell>
                      <TableCell>{grade.courseName}</TableCell>
                      <TableCell>{grade.units}</TableCell>
                      <TableCell>
                        <Badge variant={getGradeColor(grade.grade)}>
                          {grade.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>{grade.semester}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Academic Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium">{grade.courseCode}</TableCell>
                      <TableCell>{grade.courseName}</TableCell>
                      <TableCell>{grade.units}</TableCell>
                      <TableCell>
                        <Badge variant={getGradeColor(grade.grade)}>
                          {grade.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>{grade.semester}</TableCell>
                      <TableCell>{grade.academicYear}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/tasks - List all tasks
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        subject: true,
      },
      orderBy: [
        { completed: 'asc' },
        { deadline: 'asc' },
      ],
    })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, subjectId, deadline, progress } = body

    if (!title || !subjectId) {
      return NextResponse.json(
        { error: 'Title and subjectId are required' },
        { status: 400 }
      )
    }

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        subjectId,
        deadline: deadline ? new Date(deadline) : null,
        progress: progress || 0,
      },
      include: {
        subject: true,
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
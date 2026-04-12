import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/subjects - List all subjects
export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        tasks: {
          orderBy: [{ completed: 'asc' }, { deadline: 'asc' }],
        },
      },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
}

// POST /api/subjects - Create a new subject
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, color } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        description: description || null,
        color: color || '#3B82F6',
      },
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    )
  }
}
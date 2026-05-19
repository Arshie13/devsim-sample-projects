import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create subjects one at a time (no transactions needed)
  const mathSubject = await prisma.subject.create({
    data: {
      name: 'Mathematics',
      description: 'Calculus, Algebra, and Statistics',
      color: '#EF4444',
    },
  })

  const csSubject = await prisma.subject.create({
    data: {
      name: 'Computer Science',
      description: 'Programming, Algorithms, and Data Structures',
      color: '#3B82F6',
    },
  })

  const physicsSubject = await prisma.subject.create({
    data: {
      name: 'Physics',
      description: 'Mechanics, Thermodynamics, and Electromagnetism',
      color: '#10B981',
    },
  })

  const englishSubject = await prisma.subject.create({
    data: {
      name: 'English',
      description: 'Literature, Writing, and Communication',
      color: '#F59E0B',
    },
  })

  console.log('Created subjects:', 4)

  // Create sample tasks for each subject
  await prisma.task.create({
    data: {
      title: 'Complete Calculus Homework Ch. 5',
      description: 'Finish all exercises from chapter 5',
      deadline: new Date('2026-04-15'),
      progress: 75,
      subjectId: mathSubject.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Study for Calculus Midterm',
      description: 'Review all topics covered',
      deadline: new Date('2026-04-20'),
      progress: 30,
      subjectId: mathSubject.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Algebra Quiz Prep',
      description: 'Practice problems on linear equations',
      deadline: new Date('2026-04-12'),
      progress: 100,
      completed: true,
      subjectId: mathSubject.id,
    },
  })

  // CS tasks
  await prisma.task.create({
    data: {
      title: 'Implement Binary Search Tree',
      description: 'Complete BST implementation with insert, delete, search',
      deadline: new Date('2026-04-14'),
      progress: 60,
      subjectId: csSubject.id,
    },
  })

  await prisma.task.create({
    data: {
      title: "Code Review: Sorting Algorithms",
      description: 'Review quicksort and mergesort implementations',
      deadline: new Date('2026-04-18'),
      progress: 0,
      subjectId: csSubject.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Set up Development Environment',
      description: 'Install VS Code, Node.js, and required extensions',
      deadline: new Date('2026-04-10'),
      progress: 100,
      completed: true,
      subjectId: csSubject.id,
    },
  })

  // Physics tasks
  await prisma.task.create({
    data: {
      title: "Lab Report: Newton's Laws",
      description: 'Write up the results from the momentum experiment',
      deadline: new Date('2026-04-16'),
      progress: 50,
      subjectId: physicsSubject.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Watch Physics Lecture Recording',
      description: 'Watch lecture 12 on thermodynamics',
      deadline: new Date('2026-04-13'),
      progress: 100,
      completed: true,
      subjectId: physicsSubject.id,
    },
  })

  // English tasks
  await prisma.task.create({
    data: {
      title: 'Essay: Shakespeare Analysis',
      description: 'Write 2000 words on Macbeth themes',
      deadline: new Date('2026-04-22'),
      progress: 20,
      subjectId: englishSubject.id,
    },
  })

  await prisma.task.create({
    data: {
      title: 'Reading: Great Gatsby Chapters 5-9',
      description: 'Complete assigned reading',
      deadline: new Date('2026-04-17'),
      progress: 100,
      completed: true,
      subjectId: englishSubject.id,
    },
  })

  console.log('Created tasks for all subjects')
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
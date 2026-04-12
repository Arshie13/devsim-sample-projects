'use client'

import { useState, useEffect, useRef } from 'react'

// Subject with its tasks
type SubjectWithTasks = {
  id: string
  name: string
  description: string | null
  color: string
  tasks: {
    id: string
    title: string
    description: string | null
    completed: boolean
    deadline: Date | string | null
    progress: number
  }[]
}

type Subject = {
  id: string
  name: string
  description: string | null
  color: string
}

type Task = {
  id: string
  title: string
  description: string | null
  completed: boolean
  deadline: Date | string | null
  progress: number
  subjectId: string
  subject?: Subject
}

async function fetchSubjects(): Promise<SubjectWithTasks[]> {
  const response = await fetch('/api/subjects')
  if (!response.ok) throw new Error('Failed to fetch subjects')
  return response.json()
}

async function createSubject(data: { name: string; description?: string; color?: string }): Promise<Subject> {
  const response = await fetch('/api/subjects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create subject')
  return response.json()
}

async function updateSubject(id: string, data: Partial<{ name: string; description: string | null; color: string }>): Promise<Subject> {
  const response = await fetch(`/api/subjects/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update subject')
  return response.json()
}

async function deleteSubject(id: string): Promise<void> {
  const response = await fetch(`/api/subjects/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete subject')
}

async function createTask(data: { title: string; description?: string; subjectId: string; deadline?: string; progress?: number }): Promise<Task> {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to create task')
  return response.json()
}

async function updateTask(id: string, data: Partial<{ title: string; description: string | null; completed: boolean; deadline: string | null; progress: number }>): Promise<Task> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Failed to update task')
  return response.json()
}

async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete task')
}

export default function Home() {
  const [subjects, setSubjects] = useState<SubjectWithTasks[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set())
  // Return loading state on server to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)
  const tempIdCounter = useRef(0)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'progress' | 'subject' | 'task' | 'create-subject' | 'delete-subject' | 'delete-task' | null>(null)
  const [editingItem, setEditingItem] = useState<{ id: string; currentValue: string | number; name?: string } | null>(null)
  const [newSubject, setNewSubject] = useState({ name: '', description: '', color: '#3B82F6' })

  const openModal = (type: 'progress' | 'subject' | 'task' | 'create-subject', id?: string, currentValue?: string | number) => {
    setModalType(type)
    setEditingItem(id && currentValue !== undefined ? { id, currentValue } : null)
    setModalOpen(true)
  }

  const openDeleteModal = (type: 'delete-subject' | 'delete-task', id: string, name?: string) => {
    setModalType(type)
    setEditingItem({ id, currentValue: '', name })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalType(null)
    setEditingItem(null)
    setNewSubject({ name: '', description: '', color: '#3B82F6' })
  }

  const loadSubjects = async () => {
    try {
      setLoading(true)
      const data = await fetchSubjects()
      setSubjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subjects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubjects()
    setMounted(true)
  }, [])

  // Loading state that renders consistently on server and client
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Subject handlers - simplified for debugging
  const handleCreateSubject = async (data: { name: string; description?: string; color?: string }) => {
    try {
      const created = await createSubject(data)
      setSubjects(prev => [...prev, { ...created, tasks: [] }])
    } catch (err) {
      console.error('Error creating subject:', err)
      setError(err instanceof Error ? err.message : 'Failed to create subject')
    }
  }

  const handleUpdateSubject = async (id: string, data: Partial<{ name: string; description: string | null; color: string }>) => {
    // Optimistic update
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...data } : s))
    try {
      await updateSubject(id, data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subject')
      await loadSubjects()
    }
  }

  const handleDeleteSubject = async (id: string) => {
    // Store for potential rollback
    const deletedSubject = subjects.find(s => s.id === id)
    // Optimistic - remove immediately
    setSubjects(prev => prev.filter(s => s.id !== id))
    try {
      await deleteSubject(id)
    } catch (err) {
      // Add back on error
      if (deletedSubject) setSubjects(prev => [...prev, deletedSubject])
      setError(err instanceof Error ? err.message : 'Failed to delete subject')
    }
  }

  // Task handlers - with optimistic updates
  const handleCreateTask = async (data: { title: string; description?: string; subjectId: string; deadline?: string; progress?: number }) => {
    const tempId = `temp-${tempIdCounter.current++}`
    const deadlineDate = data.deadline ? new Date(data.deadline) : null
    const newTask = {
      id: tempId,
      title: data.title,
      description: data.description || null,
      completed: false,
      deadline: deadlineDate,
      progress: data.progress || 0,
    }
    // Optimistic - add to subject immediately
    setSubjects(prev => prev.map(s => {
      if (s.id === data.subjectId) {
        return { ...s, tasks: [...s.tasks, newTask] }
      }
      return s
    }))
    
    try {
      const created = await createTask(data)
      // Replace temp with real task
      setSubjects(prev => prev.map(s => ({
        ...s,
        tasks: s.tasks.map(t => t.id === tempId ? { ...created, subject: undefined } : t)
      })))
    } catch (err) {
      // Remove temp on error
      setSubjects(prev => prev.map(s => ({
        ...s,
        tasks: s.tasks.filter(t => t.id !== tempId)
      })))
      setError(err instanceof Error ? err.message : 'Failed to create task')
    }
  }

  const handleUpdateTask = async (id: string, data: Partial<{ title: string; description: string | null; completed: boolean; deadline: string | null; progress: number }>) => {
    // Store original for rollback
    const originalTask = subjects.flatMap(s => s.tasks).find(t => t.id === id)
    // Optimistic update
    setSubjects(prev => prev.map(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id === id ? { ...t, ...data } : t)
    })))
    
    try {
      await updateTask(id, data)
    } catch (err) {
      // Restore on error
      if (originalTask) {
        setSubjects(prev => prev.map(s => ({
          ...s,
          tasks: s.tasks.map(t => t.id === id ? originalTask : t)
        })))
      }
      setError(err instanceof Error ? err.message : 'Failed to update task')
    }
  }

  const handleDeleteTask = async (id: string) => {
    // Store for rollback
    let deletedTask: typeof subjects[0]['tasks'][0] | undefined
    let parentSubjectId: string | undefined
    
    for (const s of subjects) {
      const t = s.tasks.find(t => t.id === id)
      if (t) {
        deletedTask = t
        parentSubjectId = s.id
        break
      }
    }
    
    // Optimistic - remove immediately
    setSubjects(prev => prev.map(s => ({
      ...s,
      tasks: s.tasks.filter(t => t.id !== id)
    })))
    
    try {
      await deleteTask(id)
    } catch (err) {
      // Add back on error
      if (deletedTask && parentSubjectId) {
        setSubjects(prev => prev.map(s => {
          if (s.id === parentSubjectId) {
            return { ...s, tasks: [...s.tasks, deletedTask!] }
          }
          return s
        }))
      }
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    }
  }

  // Optimistic update for task progress - updates state without full reload
  const updateTaskProgressOptimistic = async (taskId: string, progress: number) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId))
    try {
      await updateTask(taskId, { progress })
      // Update local state immediately without reload
      setSubjects(prev => prev.map(subject => ({
        ...subject,
        tasks: subject.tasks.map(task => 
          task.id === taskId ? { ...task, progress } : task
        )
      })))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress')
      // Reload on error to sync state
      await loadSubjects()
    } finally {
      setUpdatingTasks(prev => {
        const next = new Set(prev)
        next.delete(taskId)
        return next
      })
    }
  }

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    // Optimistic update - update UI immediately without reload
    setSubjects(prev => prev.map(subject => ({
      ...subject,
      tasks: subject.tasks.map(task => 
        task.id === taskId ? { ...task, completed: !completed } : task
      )
    })))
    try {
      await updateTask(taskId, { completed: !completed })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      // Reload on error
      await loadSubjects()
    }
  }

  // Calculate overall progress
  const totalTasks = subjects.reduce((acc, s) => acc + s.tasks.length, 0)
  const completedTasks = subjects.reduce(
    (acc, s) => acc + s.tasks.filter((t) => t.completed).length,
    0
  )
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Note: Loading and error states are handled by the initial mounted check
  return (
    <div className="min-h-screen">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-200/10 to-pink-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
      {/* Progress Overview */}
      {mounted && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 p-6 mb-8 border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-700">Overall Progress</h2>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {overallProgress}%
            </span>
          </div>
        </div>
        <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent h-1/2 rounded-t-full" />
        </div>
        <p className="text-sm text-slate-500 mt-3 flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>
      )}

      {/* Add Subject Button */}
      <div className="mb-6">
        <button
          onClick={() => openModal('create-subject')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Subject
        </button>
      </div>

      {/* Subjects Grid */}
      {mounted && subjects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {subjects.map((subject) => {
          const subjectTotalTasks = subject.tasks.length
          const subjectCompletedTasks = subject.tasks.filter((t) => t.completed).length
          const subjectProgress =
            subjectTotalTasks > 0
              ? Math.round((subjectCompletedTasks / subjectTotalTasks) * 100)
              : 0

          return (
            <div
              key={subject.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg shadow-slate-200/50 overflow-hidden hover:shadow-xl hover:shadow-slate-300/50 transition-all duration-300 border border-slate-100"
            >
              {/* Subject Header */}
              <div
                className="p-4 text-white relative overflow-hidden"
                style={{ backgroundColor: subject.color }}
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-8 -mt-8" />
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{subject.name}</h3>
                    {subject.description && (
                      <p className="text-sm opacity-90 mt-1">{subject.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={() => handleCreateTask({ title: 'New Task', subjectId: subject.id })}
                      className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                      title="Add Task"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openModal('subject', subject.id, subject.name)}
                      className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                      title="Edit Subject"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => openDeleteModal('delete-subject', subject.id, subject.name)}
                      className="w-8 h-8 bg-red-500/80 hover:bg-red-600/80 rounded-lg flex items-center justify-center transition-colors"
                      title="Delete Subject"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Subject Progress */}
              <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-slate-600 font-medium">Progress:</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${subjectProgress}%`,
                        backgroundColor: subject.color,
                      }}
                    />
                  </div>
                  <span className="font-semibold text-slate-700 min-w-[3rem] text-right">{subjectProgress}%</span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="p-5">
                {subject.tasks.length === 0 ? (
                  <p className="text-slate-400 text-center py-6">No tasks yet</p>
                ) : (
                  <ul className="space-y-2">
                    {subject.tasks.map((task) => (
                      <li
                        key={task.id}
                        className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
                          task.completed
                            ? 'bg-slate-50/80 border border-slate-100'
                            : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                        }`}
                      >
                        <div
                          onClick={() => toggleTaskCompletion(task.id, task.completed)}
                          className={`mt-0.5 w-4 h-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                            task.completed
                              ? 'bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600'
                              : 'border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {task.completed && (
                            <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="8" height="8">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-medium ${
                                  task.completed
                                    ? 'line-through text-slate-400'
                                    : 'text-slate-700'
                                }`}
                              >
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-sm text-slate-500 mt-0.5">{task.description}</p>
                              )}
                              <div className="flex items-center gap-3 mt-2">
                                {task.deadline && (
                                  <p className="text-xs text-slate-400 flex items-center gap-1">
                                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="12" height="12">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span suppressHydrationWarning>
                                      {new Date(String(task.deadline)).toLocaleDateString('en-GB', {
                                        month: 'short',
                                        day: 'numeric',
                                      })}
                                    </span>
                                  </p>
                                )}
                                {/* Progress indicator - click to edit */}
                                <div 
                                  className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 rounded px-1.5 py-1 -ml-1 transition-colors group"
                                  onClick={() => openModal('progress', task.id, task.progress)}
                                  title="Click to edit progress"
                                >
                                  {/* Progress circle */}
                                  <div className={`relative w-5 h-5 ${updatingTasks.has(task.id) ? 'animate-pulse' : ''}`}>
                                    <svg className="w-5 h-5 transform -rotate-90" viewBox="0 0 24 24">
                                      <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-slate-200"
                                      />
                                      <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeDasharray={`${task.progress * 0.565} 56.55`}
                                        strokeLinecap="round"
                                        className="text-green-500 transition-all duration-300"
                                      />
                                    </svg>
                                    {task.progress === 0 && (
                                      <svg className="absolute inset-0 w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                    )}
                                  </div>
                                  <p className={`text-xs min-w-[2.5rem] ${task.progress > 0 ? 'text-slate-700 font-medium' : 'text-slate-400 group-hover:text-slate-500'}`}>
                                    {task.progress > 0 ? `${task.progress}%` : 'Add %'}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-2">
                              <button
                                onClick={() => openModal('task', task.id, task.title)}
                                className="w-6 h-6 text-slate-400 hover:text-slate-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                                title="Edit Task"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => openDeleteModal('delete-task', task.id, task.title)}
                                className="w-6 h-6 text-red-400 hover:text-red-600 rounded transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Task"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )
        })}
      </div>
      )}

      {mounted && subjects.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            <svg className="w-8 h-8 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="32" height="32">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-slate-500 font-medium">No subjects yet</p>
          <p className="text-slate-400 text-sm mt-2">
            Add subjects and tasks using the API or seed data
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {mounted && modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={closeModal}
          />
          {/* Modal Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800">
                {modalType === 'progress' && 'Update Progress'}
                {modalType === 'subject' && 'Edit Subject'}
                {modalType === 'task' && 'Edit Task'}
                {modalType === 'create-subject' && 'Create New Subject'}
                {modalType === 'delete-subject' && 'Delete Subject'}
                {modalType === 'delete-task' && 'Delete Task'}
              </h3>
              <button 
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Content */}
            {modalType === 'progress' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-3">
                    Progress Percentage
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Number(editingItem.currentValue)}
                      onChange={(e) => setEditingItem({ ...editingItem, currentValue: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    />
                    <span className="text-2xl font-bold text-slate-800 min-w-[4rem] text-center">
                      {Number(editingItem.currentValue)}%
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      updateTaskProgressOptimistic(editingItem.id, Number(editingItem.currentValue))
                      closeModal()
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
            {modalType === 'subject' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={String(editingItem.currentValue)}
                    onChange={(e) => setEditingItem({ ...editingItem, currentValue: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateSubject(editingItem.id, { name: String(editingItem.currentValue) })
                      closeModal()
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
            {modalType === 'task' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={String(editingItem.currentValue)}
                    onChange={(e) => setEditingItem({ ...editingItem, currentValue: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleUpdateTask(editingItem.id, { title: String(editingItem.currentValue) })
                      closeModal()
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
            {modalType === 'create-subject' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800"
                    placeholder="Enter subject name"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    Description (optional)
                  </label>
                  <textarea
                    value={newSubject.description}
                    onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800 resize-none"
                    placeholder="Enter subject description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-3">
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newSubject.color}
                      onChange={(e) => setNewSubject({ ...newSubject, color: e.target.value })}
                      className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <span className="text-sm text-slate-600">{newSubject.color}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (newSubject.name.trim()) {
                        handleCreateSubject({
                          name: newSubject.name.trim(),
                          description: newSubject.description.trim() || undefined,
                          color: newSubject.color
                        })
                        closeModal()
                      }
                    }}
                    disabled={!newSubject.name.trim()}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Subject
                  </button>
                </div>
              </div>
            )}
            {modalType === 'delete-subject' && editingItem && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <p className="text-slate-600">
                    Are you sure you want to delete <span className="font-semibold text-slate-800">{editingItem.name}</span> and all its tasks?
                  </p>
                  <p className="text-sm text-slate-400 mt-2">This action cannot be undone.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      deleteSubject(editingItem.id)
                      loadSubjects()
                      closeModal()
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/25"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
            {modalType === 'delete-task' && editingItem && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                  <p className="text-slate-600">
                    Are you sure you want to delete <span className="font-semibold text-slate-800">{editingItem.name}</span>?
                  </p>
                  <p className="text-sm text-slate-400 mt-2">This action cannot be undone.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      deleteTask(editingItem.id)
                      loadSubjects()
                      closeModal()
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/25"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}
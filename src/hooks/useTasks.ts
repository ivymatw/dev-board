'use client'

import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Task, TaskFilter, Priority, Status } from '@/lib/types'

const DEFAULT_TASKS: Task[] = [
  {
    id: uuidv4(),
    title: '歡迎使用 DevBoard',
    description: '這是您的第一個任務！您可以編輯或刪除它。',
    userRequirement: '',
    priority: 'medium',
    status: 'todo',
    tags: ['歡迎'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: '建立新任務',
    description: '點擊上方的新增按鈕來建立新的任務卡片。',
    userRequirement: '',
    priority: 'high',
    status: 'in-progress',
    tags: ['教學'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: '完成範例任務',
    description: '將這個任務拖曳到已完成欄位，或點擊編輯按鈕修改狀態。',
    userRequirement: '',
    priority: 'low',
    status: 'done',
    tags: ['教學', '範例'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const API_BASE = '/api/tasks'

async function fetchTasks(): Promise<Task[]> {
  const res = await fetch(API_BASE)
  if (!res.ok) throw new Error('Failed to fetch tasks')
  return res.json()
}

async function saveTasksToServer(tasks: Task[]): Promise<void> {
  // Delete all and recreate
  for (const task of tasks) {
    if (tasks.indexOf(task) === 0) {
      // First task - create or replace
      const existing = await fetch(API_BASE)
      if (existing.ok) {
        const existingTasks: Task[] = await existing.json()
        // Delete all existing
        for (const t of existingTasks) {
          await fetch(`${API_BASE}/${t.id}`, { method: 'DELETE' })
        }
      }
    }
    // Create new task
    await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        userRequirement: task.userRequirement,
        priority: task.priority,
        tags: task.tags,
        status: task.status,
      }),
    })
  }
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>({
    search: '',
    priority: null,
    tags: [],
  })
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load tasks from server on mount
  useEffect(() => {
    fetchTasks()
      .then((serverTasks) => {
        if (serverTasks.length > 0) {
          setTasks(serverTasks)
        } else {
          // Set default tasks for first-time users
          setTasks(DEFAULT_TASKS)
          DEFAULT_TASKS.forEach(task => {
            fetch(API_BASE, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: task.title,
                description: task.description,
                userRequirement: task.userRequirement,
                priority: task.priority,
                tags: task.tags,
              }),
            })
          })
        }
        setIsLoaded(true)
      })
      .catch(() => {
        setTasks(DEFAULT_TASKS)
        setIsLoaded(true)
      })
  }, [])

  // Save tasks to server whenever they change
  useEffect(() => {
    if (isLoaded && !isSaving) {
      const timeout = setTimeout(() => {
        setIsSaving(true)
        fetch(API_BASE)
          .then(res => res.json())
          .then(async (serverTasks: Task[]) => {
            // Compare and sync
            const serverIds = new Set(serverTasks.map(t => t.id))
            const localIds = new Set(tasks.map(t => t.id))
            
            // Delete tasks not in local
            for (const st of serverTasks) {
              if (!localIds.has(st.id)) {
                await fetch(`${API_BASE}/${st.id}`, { method: 'DELETE' })
              }
            }
            
            // Update or create tasks
            for (const task of tasks) {
              if (serverIds.has(task.id)) {
                await fetch(`${API_BASE}/${task.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(task),
                })
              } else {
                await fetch(API_BASE, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    title: task.title,
                    description: task.description,
                    userRequirement: task.userRequirement,
                    priority: task.priority,
                    tags: task.tags,
                    status: task.status,
                  }),
                })
              }
            }
            setIsSaving(false)
          })
          .catch(() => setIsSaving(false))
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [tasks, isLoaded, isSaving])

  const addTask = useCallback((
    title: string,
    description: string,
    userRequirement: string,
    priority: Priority,
    tags: string[]
  ) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      userRequirement,
      priority,
      status: 'todo',
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setTasks(prev => [...prev, newTask])
    return newTask
  }, [])

  const updateTask = useCallback((
    id: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt'>>
  ) => {
    setTasks(prev => prev.map(task =>
      task.id === id
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ))
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }, [])

  const updateTaskStatus = useCallback((id: string, status: Status) => {
    updateTask(id, { status })
  }, [updateTask])

  const filteredTasks = tasks.filter(task => {
    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      const matchesTitle = task.title.toLowerCase().includes(searchLower)
      const matchesDescription = task.description.toLowerCase().includes(searchLower)
      if (!matchesTitle && !matchesDescription) return false
    }

    // Priority filter
    if (filter.priority && task.priority !== filter.priority) {
      return false
    }

    // Tags filter
    if (filter.tags.length > 0) {
      const hasMatchingTag = filter.tags.some(tag =>
        task.tags.includes(tag)
      )
      if (!hasMatchingTag) return false
    }

    return true
  })

  const getTasksByStatus = useCallback((status: Status) => {
    return filteredTasks.filter(task => task.status === status)
  }, [filteredTasks])

  const getAllTags = useCallback(() => {
    const tags = new Set<string>()
    tasks.forEach(task => task.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags).sort()
  }, [tasks])

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    filter,
    setFilter,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksByStatus,
    getAllTags,
    isLoaded,
  }
}

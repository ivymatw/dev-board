'use client'

import { useState, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Task, TaskFilter, Priority, Status } from '@/lib/types'
import { getTasks, saveTasks } from '@/lib/storage'

const DEFAULT_TASKS: Task[] = [
  {
    id: uuidv4(),
    title: '歡迎使用 DevBoard',
    description: '這是您的第一個任務！您可以編輯或刪除它。',
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
    priority: 'low',
    status: 'done',
    tags: ['教學', '範例'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>({
    search: '',
    priority: null,
    tags: [],
  })
  const [isLoaded, setIsLoaded] = useState(false)

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = getTasks()
    if (storedTasks.length > 0) {
      setTasks(storedTasks)
    } else {
      // Set default tasks for first-time users
      setTasks(DEFAULT_TASKS)
      saveTasks(DEFAULT_TASKS)
    }
    setIsLoaded(true)
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      saveTasks(tasks)
    }
  }, [tasks, isLoaded])

  const addTask = useCallback((
    title: string,
    description: string,
    priority: Priority,
    tags: string[]
  ) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
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

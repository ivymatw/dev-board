import { Task } from './types'

const STORAGE_KEY = 'dev-board-tasks'

export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return []
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const exportTasksToJson = (tasks: Task[]): string => {
  return JSON.stringify(tasks, null, 2)
}

export const importTasksFromJson = (json: string): Task[] | null => {
  try {
    const tasks = JSON.parse(json)
    if (Array.isArray(tasks)) {
      return tasks
    }
    return null
  } catch {
    return null
  }
}

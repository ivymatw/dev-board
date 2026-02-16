import * as fs from 'fs'
import * as path from 'path'
import { Task } from './types'

const STORAGE_DIR = path.join(process.cwd(), 'data')
const TASKS_FILE = path.join(STORAGE_DIR, 'tasks.json')
const LOCK_FILE = path.join(STORAGE_DIR, 'tasks.lock')

// Ensure data directory exists
const ensureDir = () => {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true })
  }
}

// Simple file-based locking for concurrent access
const acquireLock = (timeout = 5000): boolean => {
  const startTime = Date.now()
  while (fs.existsSync(LOCK_FILE)) {
    if (Date.now() - startTime > timeout) {
      console.warn('Lock acquisition timeout')
      return false
    }
    // Wait a bit before checking again
    const waitUntil = Date.now() + 50
    while (Date.now() < waitUntil) {
      // busy wait
    }
  }
  fs.writeFileSync(LOCK_FILE, String(process.pid))
  return true
}

const releaseLock = (): void => {
  if (fs.existsSync(LOCK_FILE)) {
    fs.unlinkSync(LOCK_FILE)
  }
}

export const getTasks = (): Task[] => {
  ensureDir()
  
  if (!fs.existsSync(TASKS_FILE)) {
    return []
  }
  
  try {
    const data = fs.readFileSync(TASKS_FILE, 'utf-8')
    const tasks = JSON.parse(data)
    return Array.isArray(tasks) ? tasks : []
  } catch (error) {
    console.error('Error reading tasks:', error)
    return []
  }
}

export const saveTasks = (tasks: Task[]): void => {
  ensureDir()
  
  if (!acquireLock()) {
    console.error('Failed to acquire lock for saving tasks')
    throw new Error('Failed to acquire lock')
  }
  
  try {
    // Write to temp file first, then rename (atomic operation)
    const tempFile = TASKS_FILE + '.tmp'
    fs.writeFileSync(tempFile, JSON.stringify(tasks, null, 2), 'utf-8')
    fs.renameSync(tempFile, TASKS_FILE)
  } catch (error) {
    console.error('Error saving tasks:', error)
    throw error
  } finally {
    releaseLock()
  }
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

export type Priority = 'low' | 'medium' | 'high'
export type Status = 'todo' | 'in-progress' | 'done'

export type DesignStatus = 'pending' | 'in-progress' | 'completed'
export type ImplementationStatus = 'pending' | 'in-progress' | 'completed'

export interface Task {
  id: string
  title: string
  description: string
  userRequirement: string
  priority: Priority
  status: Status
  tags: string[]
  createdAt: string
  updatedAt: string
  repoUrl?: string
  designStatus?: DesignStatus
  implementationStatus?: ImplementationStatus
}

export interface TaskFilter {
  search: string
  priority: Priority | null
  tags: string[]
}

export interface TaskFormData {
  title: string
  description: string
  userRequirement: string
  priority: Priority
  tags: string[]
}

export const STATUS_LABELS: Record<Status, string> = {
  'todo': '待辦',
  'in-progress': '進行中',
  'done': '已完成',
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  'low': '低',
  'medium': '中',
  'high': '高',
}

export const PRIORITY_COLORS: Record<Priority, string> = {
  'low': 'bg-green-500',
  'medium': 'bg-amber-500',
  'high': 'bg-red-500',
}

export const STATUS_COLORS: Record<Status, string> = {
  'todo': 'border-l-slate-500',
  'in-progress': 'border-l-blue-500',
  'done': 'border-l-green-500',
}

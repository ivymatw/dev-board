'use client'

import { Task, Status, STATUS_LABELS } from '@/lib/types'
import { Column } from './Column'

interface BoardProps {
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onStatusChange: (id: string, status: Status) => void
  onRefreshTasks: () => void
}

const COLUMNS: Status[] = ['todo', 'in-progress', 'done']

export function Board({ tasks, onEditTask, onDeleteTask, onStatusChange, onRefreshTasks }: BoardProps) {
  const getTasksByStatus = (status: Status) => {
    return tasks.filter(task => task.status === status)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-6 lg:px-8">
      {COLUMNS.map(status => (
        <Column
          key={status}
          status={status}
          tasks={getTasksByStatus(status)}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onStatusChange={onStatusChange}
          onRefreshTasks={onRefreshTasks}
        />
      ))}
    </div>
  )
}

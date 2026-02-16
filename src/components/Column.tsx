'use client'

import { Task, Status, STATUS_LABELS } from '@/lib/types'
import { TaskCard } from './TaskCard'

interface ColumnProps {
  status: Status
  tasks: Task[]
  onEditTask: (task: Task) => void
  onDeleteTask: (id: string) => void
  onStatusChange: (id: string, status: Status) => void
}

const STATUS_CONFIG = {
  'todo': {
    bg: 'bg-slate-100 dark:bg-slate-800/50',
    dot: 'bg-slate-500',
    border: 'border-slate-300 dark:border-slate-600',
  },
  'in-progress': {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    dot: 'bg-blue-500',
    border: 'border-blue-300 dark:border-blue-600',
  },
  'done': {
    bg: 'bg-green-50 dark:bg-green-900/20',
    dot: 'bg-green-500',
    border: 'border-green-300 dark:border-green-600',
  },
}

export function Column({ status, tasks, onEditTask, onDeleteTask, onStatusChange }: ColumnProps) {
  const config = STATUS_CONFIG[status]

  return (
    <div className={`flex-1 min-w-[280px] max-w-[400px] rounded-xl ${config.bg} border ${config.border} p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${config.dot}`} />
          <h2 className="font-semibold">{STATUS_LABELS[status]}</h2>
          <span className="px-2 py-0.5 text-sm bg-muted rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
        {tasks.map(task => (
          <div key={task.id}>
            <TaskCard
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
            {/* Status change buttons */}
            <div className="flex justify-center mt-1 mb-2">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
                className="text-xs bg-transparent border border-border rounded px-2 py-1 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <option value="todo">移至待辦</option>
                <option value="in-progress">移至進行中</option>
                <option value="done">移至已完成</option>
              </select>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            沒有任務
          </div>
        )}
      </div>
    </div>
  )
}

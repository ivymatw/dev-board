'use client'

import { Edit2, Trash2, GripVertical } from 'lucide-react'
import { Task, PRIORITY_COLORS, STATUS_COLORS } from '@/lib/types'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const priorityColor = {
    low: 'bg-green-500',
    medium: 'bg-amber-500',
    high: 'bg-red-500',
  }[task.priority]

  return (
    <div
      className={`task-card bg-surface border border-border border-l-4 ${STATUS_COLORS[task.status]} rounded-lg p-4 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-foreground line-clamp-2">{task.title}</h3>
        <div className="flex items-center gap-1 shrink-0">
          <span className={`w-2 h-2 rounded-full ${priorityColor}`} title={`${task.priority} priority`} />
        </div>
      </div>
      
      {task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {new Date(task.createdAt).toLocaleDateString('zh-TW')}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded transition-colors"
            aria-label="編輯任務"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-muted rounded transition-colors"
            aria-label="刪除任務"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

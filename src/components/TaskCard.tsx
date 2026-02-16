'use client'

import { Edit2, Trash2, GripVertical, FileText, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Task, PRIORITY_COLORS, STATUS_COLORS } from '@/lib/types'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onSpecGenerated?: (task: Task) => void
}

export function TaskCard({ task, onEdit, onDelete, onSpecGenerated }: TaskCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  const priorityColor = {
    low: 'bg-green-500',
    medium: 'bg-amber-500',
    high: 'bg-red-500',
  }[task.priority]

  const hasUserRequirement = task.userRequirement && task.userRequirement.trim().length > 0
  const hasRepoUrl = !!task.repoUrl

  const handleGenerateSpec = async () => {
    if (!hasUserRequirement) return
    
    setIsGenerating(true)
    setGenerateError(null)

    try {
      const response = await fetch('/api/specs/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: task.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate spec')
      }

      // Notify parent to refresh tasks
      if (onSpecGenerated) {
        onSpecGenerated({ ...task, repoUrl: data.repoUrl })
      }
    } catch (error) {
      console.error('Error generating spec:', error)
      setGenerateError(error instanceof Error ? error.message : 'Failed to generate spec')
    } finally {
      setIsGenerating(false)
    }
  }

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
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      
      {task.userRequirement && (
        <div className="text-sm bg-blue-50 dark:bg-blue-950 p-2 rounded mb-2 line-clamp-2 border-l-2 border-blue-500">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">使用者需求：</span>
          <p className="text-blue-700 dark:text-blue-300 text-xs mt-0.5">{task.userRequirement}</p>
        </div>
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
            onClick={handleGenerateSpec}
            disabled={!hasUserRequirement || isGenerating}
            className={`p-1.5 rounded transition-colors ${
              !hasUserRequirement
                ? 'text-muted-foreground/50 cursor-not-allowed'
                : isGenerating
                ? 'text-muted-foreground cursor-wait'
                : hasRepoUrl
                ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950'
                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950'
            }`}
            aria-label={hasRepoUrl ? '更新規格' : '產生規格'}
            title={
              !hasUserRequirement
                ? '請先新增使用者需求'
                : hasRepoUrl
                ? '更新規格'
                : '產生規格'
            }
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
          </button>
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
      {generateError && (
        <p className="text-xs text-red-500 mt-2">{generateError}</p>
      )}
    </div>
  )
}

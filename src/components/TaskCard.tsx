'use client'

import { Edit2, Trash2, GripVertical, FileText, Loader2, Sparkles, PlayCircle, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import { Task, PRIORITY_COLORS, STATUS_COLORS } from '@/lib/types'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onSpecGenerated?: (task: Task) => void
}

export function TaskCard({ task, onEdit, onDelete, onSpecGenerated }: TaskCardProps) {
  const [isGeneratingSpec, setIsGeneratingSpec] = useState(false)
  const [isGeneratingDesign, setIsGeneratingDesign] = useState(false)
  const [isImplementing, setIsImplementing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const priorityColor = {
    low: 'bg-green-500',
    medium: 'bg-amber-500',
    high: 'bg-red-500',
  }[task.priority]

  const hasUserRequirement = task.userRequirement && task.userRequirement.trim().length > 0
  const hasRepo = !!task.repoUrl
  const isDesignCompleted = task.designStatus === 'completed'
  const isImplementingStatus = task.implementationStatus === 'in-progress'
  const isImplemented = task.implementationStatus === 'completed'

  const handleGenerateSpec = async () => {
    if (!hasUserRequirement) return
    
    setIsGeneratingSpec(true)
    setError(null)

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
    } catch (err) {
      console.error('Error generating spec:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate spec')
    } finally {
      setIsGeneratingSpec(false)
    }
  }

  const handleGenerateDesign = async () => {
    if (!hasRepo) return
    
    setIsGeneratingDesign(true)
    setError(null)

    try {
      const response = await fetch('/api/specs/design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: task.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate design')
      }

      // Refresh the task
      if (onSpecGenerated) {
        onSpecGenerated({ 
          ...task, 
          repoUrl: data.repoUrl,
          designStatus: 'completed'
        })
      }
    } catch (err) {
      console.error('Error generating design:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate design')
    } finally {
      setIsGeneratingDesign(false)
    }
  }

  const handleImplement = async () => {
    if (!hasRepo) return
    
    setIsImplementing(true)
    setError(null)

    try {
      const response = await fetch('/api/specs/implement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId: task.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start implementation')
      }

      // Refresh the task
      if (onSpecGenerated) {
        onSpecGenerated({ 
          ...task, 
          implementationStatus: 'in-progress'
        })
      }
      
      alert(`Implementation started! ${data.totalSteps} steps to complete.`)
    } catch (err) {
      console.error('Error implementing:', err)
      setError(err instanceof Error ? err.message : 'Failed to start implementation')
    } finally {
      setIsImplementing(false)
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
      
      {/* Status indicators */}
      <div className="flex flex-wrap gap-2 mb-3">
        {hasRepo && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded">
            <FileText className="w-3 h-3" />
            規格已產生
          </span>
        )}
        {isDesignCompleted && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded">
            <Sparkles className="w-3 h-3" />
            設計已完成
          </span>
        )}
        {isImplementingStatus && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-amber-100 text-amber-amber-900-700 dark:bg dark:text-amber-300 rounded">
            <Loader2 className="w-3 h-3 animate-spin" />
            實作中
          </span>
        )}
        {isImplemented && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded">
            <CheckCircle className="w-3 h-3" />
            實作完成
          </span>
        )}
      </div>
      
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
          {/* Spec button */}
          <button
            onClick={handleGenerateSpec}
            disabled={!hasUserRequirement || isGeneratingSpec}
            className={`p-1.5 rounded transition-colors ${
              !hasUserRequirement
                ? 'text-muted-foreground/50 cursor-not-allowed'
                : isGeneratingSpec
                ? 'text-muted-foreground cursor-wait'
                : hasRepo
                ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950'
                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950'
            }`}
            aria-label={hasRepo ? '更新規格' : '產生規格'}
            title={
              !hasUserRequirement
                ? '請先新增使用者需求'
                : hasRepo
                ? '更新規格'
                : '產生規格'
            }
          >
            {isGeneratingSpec ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
          </button>

          {/* System Design button */}
          <button
            onClick={handleGenerateDesign}
            disabled={!hasRepo || isGeneratingDesign || isDesignCompleted}
            className={`p-1.5 rounded transition-colors ${
              !hasRepo
                ? 'text-muted-foreground/50 cursor-not-allowed'
                : isGeneratingDesign
                ? 'text-muted-foreground cursor-wait'
                : isDesignCompleted
                ? 'text-purple-400 cursor-not-allowed'
                : 'text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950'
            }`}
            aria-label={isDesignCompleted ? '系統設計已完成' : '系統設計'}
            title={
              !hasRepo
                ? '請先產生規格'
                : isDesignCompleted
                ? '系統設計已完成'
                : '系統設計'
            }
          >
            {isGeneratingDesign ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </button>

          {/* Implement button */}
          <button
            onClick={handleImplement}
            disabled={!hasRepo || isImplementing || isImplemented}
            className={`p-1.5 rounded transition-colors ${
              !hasRepo
                ? 'text-muted-foreground/50 cursor-not-allowed'
                : isImplementing
                ? 'text-muted-foreground cursor-wait'
                : isImplemented
                ? 'text-green-400 cursor-not-allowed'
                : 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950'
            }`}
            aria-label={isImplemented ? '實作完成' : '開始實作'}
            title={
              !hasRepo
                ? '請先完成系統設計'
                : isImplemented
                ? '實作完成'
                : '開始實作'
            }
          >
            {isImplementing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isImplemented ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <PlayCircle className="w-4 h-4" />
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
      {error && (
        <p className="text-xs text-red-500 mt-2">{error}</p>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { X, Tag as TagIcon } from 'lucide-react'
import { Task, Priority, TaskFormData } from '@/lib/types'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => void
  task?: Task | null
}

const PRIORITIES: Priority[] = ['low', 'medium', 'high']

export function TaskModal({ isOpen, onClose, onSubmit, task }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [tagsInput, setTagsInput] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
      setTagsInput(task.tags.join(', '))
    } else {
      setTitle('')
      setDescription('')
      setPriority('medium')
      setTagsInput('')
    }
  }, [task, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    onSubmit({
      title,
      description,
      priority,
      tags,
    })
    
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black/50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div 
        className="modal-content w-full max-w-md bg-surface rounded-xl shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">
            {task ? '編輯任務' : '新增任務'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              標題 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="輸入任務標題"
              required
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              描述
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="輸入任務描述"
              rows={3}
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>
          
          {/* Priority */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              優先級
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-lg border transition-colors ${
                    priority === p
                      ? p === 'high' 
                        ? 'bg-red-500 border-red-500 text-white'
                        : p === 'medium'
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'bg-green-500 border-green-500 text-white'
                      : 'border-border hover:bg-muted'
                  }`}
                >
                  {p === 'high' ? '高' : p === 'medium' ? '中' : '低'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              <span className="flex items-center gap-1">
                <TagIcon className="w-4 h-4" />
                標籤
              </span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="輸入標籤，用逗號分隔"
              className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              用逗號分隔多個標籤
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {task ? '儲存變更' : '建立任務'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

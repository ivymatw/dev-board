'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { FilterBar } from '@/components/FilterBar'
import { Board } from '@/components/Board'
import { TaskModal } from '@/components/TaskModal'
import { useTasks } from '@/hooks/useTasks'
import { Task, TaskFormData, Status } from '@/lib/types'
import { AlertTriangle } from 'lucide-react'

export default function Home() {
  const {
    tasks,
    filter,
    setFilter,
    addTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    refreshTasks,
    getAllTags,
    isLoaded,
  } = useTasks()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null)

  const handleNewTask = () => {
    setEditingTask(null)
    setIsModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }

  const handleSubmitTask = async (data: TaskFormData) => {
    if (editingTask) {
      const hadNoRequirement = !editingTask.userRequirement || editingTask.userRequirement.trim() === ''
      const hasNewRequirement = data.userRequirement && data.userRequirement.trim().length > 0
      
      updateTask(editingTask.id, {
        title: data.title,
        description: data.description,
        userRequirement: data.userRequirement,
        priority: data.priority,
        tags: data.tags,
      })
      
      // Generate spec if userRequirement was added or changed
      if (hasNewRequirement) {
        const updatedTask = { ...editingTask, ...data }
        try {
          await fetch('/api/specs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: updatedTask.id }),
          })
        } catch (error) {
          console.error('Failed to generate spec:', error)
        }
      }
    } else {
      const newTask = addTask(data.title, data.description, data.userRequirement, data.priority, data.tags)
      
      // Generate spec if userRequirement exists
      if (data.userRequirement && data.userRequirement.trim().length > 0) {
        try {
          await fetch('/api/specs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: newTask.id }),
          })
        } catch (error) {
          console.error('Failed to generate spec:', error)
        }
      }
    }
  }

  const handleDeleteTask = (id: string) => {
    setDeletingTaskId(id)
  }

  const confirmDelete = () => {
    if (deletingTaskId) {
      deleteTask(deletingTaskId)
      setDeletingTaskId(null)
    }
  }

  const handleStatusChange = (id: string, status: Status) => {
    updateTaskStatus(id, status)
  }

  const handleRefreshTasks = () => {
    refreshTasks()
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">載入中...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header onNewTask={handleNewTask} />
      
      <FilterBar
        filter={filter}
        setFilter={setFilter}
        allTags={getAllTags()}
      />
      
      <div className="flex-1 overflow-auto">
        <Board
          tasks={tasks}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onRefreshTasks={handleRefreshTasks}
        />
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTask}
        task={editingTask}
      />

      {/* Delete Confirmation Modal */}
      {deletingTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop bg-black/50">
          <div className="modal-content w-full max-w-sm bg-surface rounded-xl shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <h2 className="text-lg font-semibold">確認刪除</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              確定要刪除這個任務嗎？此操作無法復原。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingTaskId(null)}
                className="flex-1 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                刪除
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

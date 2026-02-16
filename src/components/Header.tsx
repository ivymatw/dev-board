'use client'

import { Plus, Kanban } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

interface HeaderProps {
  onNewTask: () => void
}

export function Header({ onNewTask }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Kanban className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">DevBoard</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={onNewTask}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">新增任務</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

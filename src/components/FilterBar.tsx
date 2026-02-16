'use client'

import { Search, X, Filter } from 'lucide-react'
import { TaskFilter, Priority } from '@/lib/types'

interface FilterBarProps {
  filter: TaskFilter
  setFilter: (filter: TaskFilter) => void
  allTags: string[]
}

export function FilterBar({ filter, setFilter, allTags }: FilterBarProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...filter, search: e.target.value })
  }

  const handlePriorityChange = (priority: Priority | null) => {
    setFilter({ ...filter, priority })
  }

  const handleTagToggle = (tag: string) => {
    const newTags = filter.tags.includes(tag)
      ? filter.tags.filter(t => t !== tag)
      : [...filter.tags, tag]
    setFilter({ ...filter, tags: newTags })
  }

  const clearFilters = () => {
    setFilter({ search: '', priority: null, tags: [] })
  }

  const hasActiveFilters = filter.search || filter.priority || filter.tags.length > 0

  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜尋任務..."
              value={filter.search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <select
              value={filter.priority || ''}
              onChange={(e) => handlePriorityChange(e.target.value as Priority || null)}
              className="px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            >
              <option value="">所有優先級</option>
              <option value="high">高優先級</option>
              <option value="medium">中優先級</option>
              <option value="low">低優先級</option>
            </select>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 5).map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filter.tags.includes(tag)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
              清除篩選
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

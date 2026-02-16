import { NextResponse } from 'next/server'
import { getTasks, saveTasks } from '@/lib/storage'
import { Task, Priority } from '@/lib/types'
import { v4 as uuidv4 } from 'uuid'

export async function GET() {
  try {
    const tasks = getTasks()
    return NextResponse.json(tasks)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, priority, tags } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const newTask: Task = {
      id: uuidv4(),
      title,
      description: description || '',
      priority: priority || 'medium',
      status: 'todo',
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const tasks = getTasks()
    tasks.push(newTask)
    saveTasks(tasks)

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

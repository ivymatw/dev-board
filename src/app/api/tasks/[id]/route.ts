import { NextResponse } from 'next/server'
import { getTasks, saveTasks } from '@/lib/storage'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tasks = getTasks()
    const task = tasks.find(t => t.id === params.id)

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const tasks = getTasks()
    const taskIndex = tasks.findIndex(t => t.id === params.id)

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    tasks[taskIndex] = updatedTask
    saveTasks(tasks)

    return NextResponse.json(updatedTask)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tasks = getTasks()
    const taskIndex = tasks.findIndex(t => t.id === params.id)

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    const deletedTask = tasks[taskIndex]
    tasks.splice(taskIndex, 1)
    saveTasks(tasks)

    return NextResponse.json(deletedTask)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}

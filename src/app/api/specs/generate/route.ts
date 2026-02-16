import { NextResponse } from 'next/server'
import { getTasks, saveTasks } from '@/lib/storage'
import { createOrUpdateSpec } from '@/lib/githubService'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { taskId } = body

    if (!taskId) {
      return NextResponse.json(
        { error: 'Task ID is required' },
        { status: 400 }
      )
    }

    const tasks = getTasks()
    const task = tasks.find(t => t.id === taskId)

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Check if task has userRequirement
    if (!task.userRequirement || task.userRequirement.trim().length === 0) {
      return NextResponse.json(
        { error: 'Task has no user requirement. Please add a user requirement first.' },
        { status: 400 }
      )
    }

    let repoUrl: string

    try {
      // Create or update SPEC.md in the repo
      console.log(`Creating/updating SPEC for task: ${task.title}`)
      repoUrl = await createOrUpdateSpec(task)
      console.log(`Repo created/updated: ${repoUrl}`)
    } catch (githubError) {
      console.error('GitHub operation failed:', githubError)
      return NextResponse.json(
        { error: `GitHub operation failed: ${githubError instanceof Error ? githubError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }

    // Update task with repoUrl
    const taskIndex = tasks.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        repoUrl,
        updatedAt: new Date().toISOString()
      }
      saveTasks(tasks)
    }

    return NextResponse.json({ 
      success: true, 
      repoUrl
    })
  } catch (error) {
    console.error('Error generating spec:', error)
    return NextResponse.json(
      { error: 'Failed to generate spec' },
      { status: 500 }
    )
  }
}

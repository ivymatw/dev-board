import { NextResponse } from 'next/server'
import { getTasks, saveTasks } from '@/lib/storage'
import { createDesignGitHubRepo } from '@/lib/githubService'

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
    const taskIndex = tasks.findIndex(t => t.id === taskId)

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    const task = tasks[taskIndex]

    // Check if task has specRepoUrl (requires spec to be generated first)
    if (!task.specRepoUrl && !task.repoUrl) {
      return NextResponse.json(
        { error: 'Please generate the specification first before creating system design.' },
        { status: 400 }
      )
    }

    // Check if design repo already exists
    if (task.designRepoUrl) {
      return NextResponse.json(
        { error: 'Design repository already exists', designRepoUrl: task.designRepoUrl },
        { status: 400 }
      )
    }

    let designRepoUrl: string

    try {
      console.log(`Creating design GitHub repo for task: ${task.title}`)
      designRepoUrl = await createDesignGitHubRepo(task)
      console.log(`Created design repo: ${designRepoUrl}`)
    } catch (githubError) {
      console.error('GitHub design operation failed:', githubError)
      return NextResponse.json(
        { error: `GitHub operation failed: ${githubError instanceof Error ? githubError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }

    // Update task with designRepoUrl and designStatus
    tasks[taskIndex] = {
      ...task,
      designRepoUrl,
      designStatus: 'completed',
      updatedAt: new Date().toISOString()
    }
    saveTasks(tasks)

    return NextResponse.json({ 
      success: true, 
      designRepoUrl
    })
  } catch (error) {
    console.error('Error generating design:', error)
    return NextResponse.json(
      { error: 'Failed to generate design' },
      { status: 500 }
    )
  }
}

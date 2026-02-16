import { NextResponse } from 'next/server'
import { getTasks, saveTasks } from '@/lib/storage'
import { createOrUpdateDesign } from '@/lib/githubService'

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

    // Check if task has repoUrl (requires spec to be generated first)
    if (!task.repoUrl) {
      return NextResponse.json(
        { error: 'Please generate the specification first before creating system design.' },
        { status: 400 }
      )
    }

    let repoUrl: string

    try {
      console.log(`Creating/updating DESIGN for task: ${task.title}`)
      repoUrl = await createOrUpdateDesign(task)
      console.log(`Design added to repo: ${repoUrl}`)
    } catch (githubError) {
      console.error('GitHub design operation failed:', githubError)
      return NextResponse.json(
        { error: `GitHub operation failed: ${githubError instanceof Error ? githubError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }

    // Update task with designStatus (repoUrl stays the same - single repo)
    tasks[taskIndex] = {
      ...task,
      repoUrl,
      designStatus: 'completed',
      updatedAt: new Date().toISOString()
    }
    saveTasks(tasks)

    return NextResponse.json({ 
      success: true, 
      repoUrl
    })
  } catch (error) {
    console.error('Error generating design:', error)
    return NextResponse.json(
      { error: 'Failed to generate design' },
      { status: 500 }
    )
  }
}

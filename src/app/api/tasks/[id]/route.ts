import { NextResponse } from 'next/server'
import { getTasks, saveTasks } from '@/lib/storage'
import { createGitHubRepo, updateGitHubRepo } from '@/lib/githubService'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tasks = getTasks()
    const task = tasks.find(t => t.id === id)

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const tasks = getTasks()
    const taskIndex = tasks.findIndex(t => t.id === id)

    if (taskIndex === -1) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    const currentTask = tasks[taskIndex]
    const newUserRequirement = body.userRequirement
    
    // Check if userRequirement changed
    const userRequirementChanged = 
      newUserRequirement !== undefined && 
      newUserRequirement !== currentTask.userRequirement
    
    // Check if this is the first time setting userRequirement (empty -> non-empty)
    const isFirstUserRequirement = 
      userRequirementChanged && 
      !currentTask.userRequirement && 
      newUserRequirement

    const updatedTask = {
      ...currentTask,
      ...body,
      updatedAt: new Date().toISOString(),
    }

    // If userRequirement changed, update GitHub repo
    if (userRequirementChanged && newUserRequirement) {
      try {
        if (isFirstUserRequirement) {
          // First time setting userRequirement - create new repo
          console.log(`Creating new GitHub repo for task: ${currentTask.title}`)
          const repoUrl = await createGitHubRepo(updatedTask)
          updatedTask.repoUrl = repoUrl
          console.log(`Created repo: ${repoUrl}`)
        } else if (currentTask.repoUrl) {
          // userRequirement modified and repo already exists - update repo
          console.log(`Updating GitHub repo for task: ${currentTask.title}`)
          await updateGitHubRepo(updatedTask, currentTask.repoUrl)
          console.log(`Updated repo: ${currentTask.repoUrl}`)
        }
      } catch (githubError) {
        // Log error but don't fail the task update
        console.error('GitHub repo operation failed:', githubError)
        // Continue with task update even if GitHub operations fail
      }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const tasks = getTasks()
    const taskIndex = tasks.findIndex(t => t.id === id)

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

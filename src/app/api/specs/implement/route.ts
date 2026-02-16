import { NextResponse } from 'next/server'
import { getTasks, saveTasks } from '@/lib/storage'
import { fetchDesignFromGitHub, commitImplementationStep } from '@/lib/githubService'

// Parse implementation steps from DESIGN.md
function parseImplementationSteps(designContent: string): string[] {
  const steps: string[] = []
  
  // Look for the "實作步驟" or "Implementation Steps" section
  const stepPatterns = [
    /##\s*(?:3\.|三\.)\s*(?:實作步驟|Implementation Steps)[\s\S]*?(?=##|$)/i,
    /(\d+)\.\s*([^\n]+)/g
  ]
  
  // Find the implementation steps section
  const sectionMatch = designContent.match(/##\s*(?:3\.|三\.)\s*(?:實作步驟|Implementation Steps)[\s\S]*?(?=##|$)/i)
  
  if (sectionMatch) {
    const section = sectionMatch[0]
    // Extract numbered items
    const items = section.match(/\d+\.\s*([^\n]+)/g)
    if (items) {
      items.forEach(item => {
        const match = item.match(/\d+\.\s*([^\n]+)/)
        if (match) {
          steps.push(match[1].trim())
        }
      })
    }
  }
  
  // If no structured steps found, create default steps
  if (steps.length === 0) {
    steps.push('環境建置 - 建立開發環境')
    steps.push('基礎架構 - 設定專案結構')
    steps.push('核心功能實作')
    steps.push('測試與部署')
    steps.push('文件整理')
  }
  
  return steps
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { taskId, stepNumber } = body

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

    // Check if design repo exists
    if (!task.designRepoUrl) {
      return NextResponse.json(
        { error: 'No design repository found. Please create system design first.' },
        { status: 400 }
      )
    }

    // If no stepNumber provided, this is the initial call - start implementation
    if (stepNumber === undefined) {
      // Fetch design content to get steps
      const designContent = await fetchDesignFromGitHub(task.designRepoUrl)
      const steps = parseImplementationSteps(designContent)
      
      // Update task status to in-progress
      tasks[taskIndex] = {
        ...task,
        implementationStatus: 'in-progress',
        updatedAt: new Date().toISOString()
      }
      saveTasks(tasks)

      return NextResponse.json({ 
        success: true, 
        steps,
        totalSteps: steps.length,
        message: 'Implementation started'
      })
    }

    // Execute specific step
    const step = body.step
    const files = body.files || {}
    
    try {
      await commitImplementationStep(
        task.designRepoUrl,
        stepNumber,
        step,
        files
      )
      
      // Check if this is the last step
      const isLastStep = body.isLastStep || false
      
      if (isLastStep) {
        tasks[taskIndex] = {
          ...task,
          implementationStatus: 'completed',
          updatedAt: new Date().toISOString()
        }
        saveTasks(tasks)
      }

      return NextResponse.json({ 
        success: true, 
        stepNumber,
        message: `Step ${stepNumber} completed and committed`
      })
    } catch (githubError) {
      console.error('Implementation step failed:', githubError)
      return NextResponse.json(
        { error: `Failed to commit step: ${githubError instanceof Error ? githubError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error implementing:', error)
    return NextResponse.json(
      { error: 'Failed to implement' },
      { status: 500 }
    )
  }
}

// GET endpoint to fetch implementation status
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const taskId = searchParams.get('taskId')

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

  // Fetch design content to get steps
  let steps: string[] = []
  let designContent = ''
  
  if (task.designRepoUrl) {
    try {
      designContent = await fetchDesignFromGitHub(task.designRepoUrl)
      steps = parseImplementationSteps(designContent)
    } catch (error) {
      console.error('Error fetching design:', error)
    }
  }

  return NextResponse.json({
    designRepoUrl: task.designRepoUrl,
    designStatus: task.designStatus || 'pending',
    implementationStatus: task.implementationStatus || 'pending',
    steps,
    specRepoUrl: task.specRepoUrl || task.repoUrl
  })
}

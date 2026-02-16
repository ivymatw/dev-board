import { NextResponse } from 'next/server'
import { getTasks, saveTasks } from '@/lib/storage'
import { Task } from '@/lib/types'
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

const SPECS_REPO = 'ivymatw/dev-board-specs'

// Generate markdown spec from task
function generateSpecFromTask(task: Task): string {
  const STATUS_LABELS: Record<string, string> = {
    'todo': '待辦',
    'in-progress': '進行中',
    'done': '已完成',
  }
  
  const PRIORITY_LABELS: Record<string, string> = {
    'low': '低',
    'medium': '中',
    'high': '高',
  }

  const createdAt = new Date(task.createdAt).toLocaleString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const updatedAt = new Date(task.updatedAt).toLocaleString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  let spec = `# 任務規格文件

## 基本資訊

| 欄位 | 值 |
|------|-----|
| **任務 ID** | \`${task.id}\` |
| **標題** | ${task.title} |
| **優先級** | ${PRIORITY_LABELS[task.priority] || task.priority} |
| **狀態** | ${STATUS_LABELS[task.status] || task.status} |
| **建立時間** | ${createdAt} |
| **更新時間** | ${updatedAt} |

## 描述

${task.description || '_（無）_'}

## 使用者需求

${task.userRequirement || '_（無）_'}

## 標籤

${task.tags.length > 0 ? task.tags.map(tag => `- ${tag}`).join('\n') : '_（無）_'}

---

*此文件由 DevBoard 自動產生*
`

  return spec
}

// Check if repo exists
function repoExists(): boolean {
  try {
    execSync(`gh repo view ${SPECS_REPO}`, { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

// Create GitHub repo
function createRepo(): void {
  console.log(`Creating repository: ${SPECS_REPO}`)
  const tempDir = path.join(process.cwd(), 'data', 'specs-repo-temp')
  
  try {
    // Create temp directory
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true })
    }
    
    // Initialize git
    execSync('git init', { cwd: tempDir, stdio: 'pipe' })
    execSync('git config user.email "ivyma@github.com"', { cwd: tempDir, stdio: 'pipe' })
    execSync('git config user.name "Ivy Ma"', { cwd: tempDir, stdio: 'pipe' })
    
    // Create initial commit
    fs.writeFileSync(path.join(tempDir, 'README.md'), '# DevBoard Specifications\n\nThis repository contains automatically generated specification documents from DevBoard.\n', 'utf-8')
    execSync('git add .', { cwd: tempDir, stdio: 'pipe' })
    execSync('git commit -m "Initial commit"', { cwd: tempDir, stdio: 'pipe' })
    
    // Create repo and push
    execSync(`gh repo create ${SPECS_REPO} --private --source=. --push`, {
      cwd: tempDir,
      stdio: 'inherit'
    })
    
    console.log('Repository created successfully')
  } catch (error) {
    console.error('Failed to create repository:', error)
    throw error
  } finally {
    // Clean up temp dir
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true })
    }
  }
}

// Push spec to GitHub
async function pushSpecToGitHub(task: Task): Promise<void> {
  // Create spec content
  const spec = generateSpecFromTask(task)
  const fileName = `spec-${task.id}.md`
  
  // Temp directory for git operations
  const tempDir = path.join(process.cwd(), 'data', 'specs-temp')
  
  try {
    // Clean up temp dir if exists
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true })
    }
    
    // Clone the repo
    console.log(`Cloning ${SPECS_REPO}...`)
    execSync(`git clone https://github.com/${SPECS_REPO}.git temp`, {
      cwd: path.join(process.cwd(), 'data'),
      stdio: 'pipe'
    })
    
    // Write spec file
    const destPath = path.join(tempDir, fileName)
    fs.writeFileSync(destPath, spec, 'utf-8')
    
    // Commit and push
    execSync('git add .', { cwd: tempDir, stdio: 'pipe' })
    execSync(`git commit -m "chore: update spec for task ${task.id} - ${task.title}"`, {
      cwd: tempDir,
      stdio: 'pipe'
    })
    execSync('git push', { cwd: tempDir, stdio: 'pipe' })
    
    console.log(`Spec pushed to GitHub for task: ${task.id}`)
  } catch (error) {
    console.error('Failed to push to GitHub:', error)
    throw error
  } finally {
    // Clean up temp dir
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true })
    }
  }
}

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
        { error: 'Task has no user requirement' },
        { status: 400 }
      )
    }

    // Check if repo exists, if not create it
    if (!repoExists()) {
      createRepo()
    }

    // Push spec to GitHub
    await pushSpecToGitHub(task)

    return NextResponse.json({ 
      success: true, 
      specUrl: `https://github.com/${SPECS_REPO}/blob/main/spec-${task.id}.md`
    })
  } catch (error) {
    console.error('Error generating spec:', error)
    return NextResponse.json(
      { error: 'Failed to generate spec' },
      { status: 500 }
    )
  }
}

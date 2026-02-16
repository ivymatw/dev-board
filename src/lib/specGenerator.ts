import { Task, STATUS_LABELS, PRIORITY_LABELS } from './types'
import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process'

const SPECS_REPO = 'ivymatw/dev-board-specs'
const SPECS_DIR = path.join(process.cwd(), 'data', 'specs')

// Generate markdown spec from task
export function generateSpecFromTask(task: Task): string {
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
| **優先級** | ${PRIORITY_LABELS[task.priority]} |
| **狀態** | ${STATUS_LABELS[task.status]} |
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

// Ensure specs directory exists
function ensureSpecsDir(): void {
  if (!fs.existsSync(SPECS_DIR)) {
    fs.mkdirSync(SPECS_DIR, { recursive: true })
  }
}

// Save spec to local file
export function saveSpecLocally(task: Task): string {
  ensureSpecsDir()
  const spec = generateSpecFromTask(task)
  const fileName = `spec-${task.id}.md`
  const filePath = path.join(SPECS_DIR, fileName)
  fs.writeFileSync(filePath, spec, 'utf-8')
  return filePath
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
  try {
    execSync(`gh repo create ${SPECS_REPO} --private --source=. --push`, {
      cwd: process.cwd(),
      stdio: 'inherit'
    })
    console.log('Repository created successfully')
  } catch (error) {
    console.error('Failed to create repository:', error)
    throw error
  }
}

// Push spec to GitHub
export async function pushSpecToGitHub(task: Task): Promise<void> {
  // Save locally first
  const localPath = saveSpecLocally(task)
  
  // Check if repo exists, if not create it
  if (!repoExists()) {
    createRepo()
  }

  // Clone repo to temp directory
  const tempDir = path.join(process.cwd(), 'data', 'specs-temp')
  
  try {
    // Clean up temp dir if exists
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true })
    }
    
    // Clone the repo
    execSync(`git clone https://github.com/${SPECS_REPO}.git temp`, {
      cwd: path.join(process.cwd(), 'data'),
      stdio: 'pipe'
    })
    
    // Copy spec file
    const fileName = `spec-${task.id}.md`
    const destPath = path.join(tempDir, fileName)
    fs.copyFileSync(localPath, destPath)
    
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

// Process task spec if userRequirement exists
export async function processTaskSpec(task: Task): Promise<void> {
  if (task.userRequirement && task.userRequirement.trim().length > 0) {
    await pushSpecToGitHub(task)
  }
}

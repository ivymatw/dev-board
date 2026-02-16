import simpleGit, { SimpleGit } from 'simple-git'
import * as fs from 'fs'
import * as path from 'path'
import { Task } from './types'

const GIT_TEMP_DIR = path.join(process.cwd(), 'data', 'git-temp')

// Ensure temp directory exists
const ensureTempDir = (): void => {
  if (!fs.existsSync(GIT_TEMP_DIR)) {
    fs.mkdirSync(GIT_TEMP_DIR, { recursive: true })
  }
}

// Generate SPEC.md content from task
const generateSpecContent = (task: Task): string => {
  return `# ${task.title}

## 描述
${task.description || '無描述'}

## 使用者需求
${task.userRequirement || '無需求'}

## 優先級
${task.priority}

## 狀態
${task.status}

## 建立時間
${task.createdAt}

## 最後更新時間
${task.updatedAt}
`
}

// Generate repo name from task title
const generateRepoName = (task: Task): string => {
  const sanitized = task.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
  return `dev-board-spec-${sanitized}`
}

// Create GitHub repo and push initial spec
export async function createGitHubRepo(task: Task): Promise<string> {
  ensureTempDir()
  
  const repoName = generateRepoName(task)
  const repoDir = path.join(GIT_TEMP_DIR, repoName)
  
  // Clean up if exists
  if (fs.existsSync(repoDir)) {
    fs.rmSync(repoDir, { recursive: true, force: true })
  }
  
  fs.mkdirSync(repoDir, { recursive: true })
  
  // Create SPEC.md
  const specContent = generateSpecContent(task)
  fs.writeFileSync(path.join(repoDir, 'SPEC.md'), specContent, 'utf-8')
  
  // Initialize git
  const git: SimpleGit = simpleGit(repoDir)
  await git.init()
  await git.addConfig('user.email', 'devboard@local')
  await git.addConfig('user.name', 'DevBoard')
  await git.add('.')
  await git.commit('Initial commit: Create SPEC.md')
  
  // Create GitHub repo using gh CLI
  const { execSync } = require('child_process')
  
  try {
    // Try to create the repo (may fail if it already exists)
    execSync(`gh repo create ${repoName} --private --source=. --push`, {
      cwd: repoDir,
      stdio: 'pipe'
    })
  } catch (error: any) {
    // If repo already exists, we need to handle differently
    // For now, let's try to push to existing repo or create with different name
    console.error('Repo creation error:', error.message)
    throw new Error(`Failed to create GitHub repo: ${error.message}`)
  }
  
  // Get the remote URL
  const remoteUrl = execSync(`git remote get-url origin`, {
    cwd: repoDir,
    encoding: 'utf-8'
  }).trim()
  
  // Convert SSH URL to HTTPS URL if needed
  let httpsUrl = remoteUrl
  if (remoteUrl.startsWith('git@github.com:')) {
    httpsUrl = remoteUrl.replace('git@github.com:', 'https://github.com/')
  }
  
  // Clean up temp directory
  fs.rmSync(repoDir, { recursive: true, force: true })
  
  return httpsUrl
}

// Update existing GitHub repo with new spec
export async function updateGitHubRepo(task: Task, repoUrl: string): Promise<void> {
  ensureTempDir()
  
  // Extract repo name from URL
  const urlParts = repoUrl.replace('https://github.com/', '').replace('.git', '').split('/')
  const repoName = urlParts.pop() || ''
  const owner = urlParts.pop() || ''
  
  const repoDir = path.join(GIT_TEMP_DIR, `${repoName}-update`)
  
  // Clean up if exists
  if (fs.existsSync(repoDir)) {
    fs.rmSync(repoDir, { recursive: true, force: true })
  }
  
  fs.mkdirSync(repoDir, { recursive: true })
  
  const { execSync } = require('child_process')
  
  try {
    // Clone the existing repo
    execSync(`gh repo clone ${owner}/${repoName} .`, {
      cwd: repoDir,
      stdio: 'pipe'
    })
  } catch (error: any) {
    console.error('Repo clone error:', error.message)
    // Try to use the existing remote if clone fails
    fs.rmSync(repoDir, { recursive: true, force: true })
    fs.mkdirSync(repoDir, { recursive: true })
    
    // Initialize fresh and add remote
    const git: SimpleGit = simpleGit(repoDir)
    await git.init()
    await git.addRemote('origin', repoUrl)
  }
  
  // Update SPEC.md
  const specContent = generateSpecContent(task)
  fs.writeFileSync(path.join(repoDir, 'SPEC.md'), specContent, 'utf-8')
  
  // Commit and push
  const git: SimpleGit = simpleGit(repoDir)
  await git.add('.')
  await git.commit('Update SPEC.md: userRequirement changed')
  await git.push()
  
  // Clean up
  fs.rmSync(repoDir, { recursive: true, force: true })
}

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

// ============= Design Repo Functions =============

// Generate DESIGN.md content using AI (simulated - will be replaced with actual AI call)
const generateDesignContent = async (task: Task): Promise<string> => {
  // This will be replaced with actual AI-generated content
  const designDoc = `# 系統設計文檔 - ${task.title}

## 1. 概述
${task.description || task.userRequirement || '基於使用者需求的系統設計'}

## 2. 使用工具建議
- 程式碼編輯器：VS Code
- 版本控制：Git + GitHub
- 雲端服務：Vercel / Netlify
- 資料庫：根據需求選擇

## 3. 實作步驟
1. 環境建置 - 建立開發環境
2. 基礎架構 - 設定專案結構
3. 核心功能實作
4. 測試與部署
5. 文件整理

## 4. 技術選型
- 前端框架：React / Next.js
- 樣式解決方案：Tailwind CSS
- 狀態管理：React Context / Zustand
- API 通訊：Fetch / Axios

## 5. 架構設計
\`\`\`
src/
├── components/     # UI 元件
├── pages/         # 頁面路由
├── lib/           # 工具函式
├── hooks/         # 自訂 Hooks
└── styles/        # 全域樣式
\`\`\`

## 6. 預期產出
- 可運作的專案程式碼
- 部署後的線上服務
- 基本的 README 文件

---

*此系統設計由 DevBoard AI 輔助產生*
`
  return designDoc
}

// Generate design repo name
const generateDesignRepoName = (task: Task): string => {
  const sanitized = task.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
  return `dev-board-design-${sanitized}`
}

// Create GitHub repo for system design
export async function createDesignGitHubRepo(task: Task): Promise<string> {
  ensureTempDir()
  
  const repoName = generateDesignRepoName(task)
  const repoDir = path.join(GIT_TEMP_DIR, repoName)
  
  // Clean up if exists
  if (fs.existsSync(repoDir)) {
    fs.rmSync(repoDir, { recursive: true, force: true })
  }
  
  fs.mkdirSync(repoDir, { recursive: true })
  
  // Generate design content
  const designContent = await generateDesignContent(task)
  fs.writeFileSync(path.join(repoDir, 'DESIGN.md'), designContent, 'utf-8')
  
  // Initialize git
  const git: SimpleGit = simpleGit(repoDir)
  await git.init()
  await git.addConfig('user.email', 'devboard@local')
  await git.addConfig('user.name', 'DevBoard')
  await git.add('.')
  await git.commit('Initial commit: Create DESIGN.md')
  
  // Create GitHub repo using gh CLI
  const { execSync } = require('child_process')
  
  try {
    execSync(`gh repo create ${repoName} --private --source=. --push`, {
      cwd: repoDir,
      stdio: 'pipe'
    })
  } catch (error: any) {
    console.error('Design repo creation error:', error.message)
    throw new Error(`Failed to create design GitHub repo: ${error.message}`)
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

// Fetch DESIGN.md content from existing design repo
export async function fetchDesignFromGitHub(designRepoUrl: string): Promise<string> {
  ensureTempDir()
  
  const tempDir = path.join(GIT_TEMP_DIR, 'design-fetch-temp')
  
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
  
  const { execSync } = require('child_process')
  
  try {
    // Extract owner and repo from URL
    const urlParts = designRepoUrl
      .replace('https://github.com/', '')
      .replace('.git', '')
      .split('/')
    const owner = urlParts[0]
    const repo = urlParts[1]
    
    // Use gh repo clone to get the content
    execSync(`gh repo clone ${owner}/${repo} temp`, {
      cwd: path.join(process.cwd(), 'data'),
      stdio: 'pipe'
    })
    
    // Read DESIGN.md
    const designPath = path.join(tempDir, 'DESIGN.md')
    if (!fs.existsSync(designPath)) {
      throw new Error('DESIGN.md not found in repository')
    }
    
    const content = fs.readFileSync(designPath, 'utf-8')
    fs.rmSync(tempDir, { recursive: true, force: true })
    
    return content
  } catch (error: any) {
    console.error('Error fetching design:', error.message)
    throw new Error(`Failed to fetch design: ${error.message}`)
  }
}

// Commit implementation step to design repo
export async function commitImplementationStep(
  designRepoUrl: string,
  stepNumber: number,
  stepDescription: string,
  files: Record<string, string>
): Promise<void> {
  ensureTempDir()
  
  const tempDir = path.join(GIT_TEMP_DIR, 'design-impl-temp')
  
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
  
  const { execSync } = require('child_process')
  
  try {
    // Extract owner and repo from URL
    const urlParts = designRepoUrl
      .replace('https://github.com/', '')
      .replace('.git', '')
      .split('/')
    const owner = urlParts[0]
    const repo = urlParts[1]
    
    // Clone the repo
    execSync(`gh repo clone ${owner}/${repo} temp`, {
      cwd: path.join(process.cwd(), 'data'),
      stdio: 'pipe'
    })
    
    // Write the files
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(tempDir, filePath)
      const dir = path.dirname(fullPath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(fullPath, content, 'utf-8')
    }
    
    // Commit and push
    const git: SimpleGit = simpleGit(tempDir)
    await git.add('.')
    await git.commit(`feat: step ${stepNumber} - ${stepDescription}`)
    await git.push()
    
    fs.rmSync(tempDir, { recursive: true, force: true })
  } catch (error: any) {
    console.error('Error committing implementation step:', error.message)
    throw new Error(`Failed to commit implementation step: ${error.message}`)
  }
}

module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/lib/storage.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "exportTasksToJson",
    ()=>exportTasksToJson,
    "getTasks",
    ()=>getTasks,
    "importTasksFromJson",
    ()=>importTasksFromJson,
    "saveTasks",
    ()=>saveTasks
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
const STORAGE_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](process.cwd(), 'data');
const TASKS_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](STORAGE_DIR, 'tasks.json');
const LOCK_FILE = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](STORAGE_DIR, 'tasks.lock');
// Ensure data directory exists
const ensureDir = ()=>{
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](STORAGE_DIR)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"](STORAGE_DIR, {
            recursive: true
        });
    }
};
// Simple file-based locking for concurrent access
const acquireLock = (timeout = 5000)=>{
    const startTime = Date.now();
    while(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](LOCK_FILE)){
        if (Date.now() - startTime > timeout) {
            console.warn('Lock acquisition timeout');
            return false;
        }
        // Wait a bit before checking again
        const waitUntil = Date.now() + 50;
        while(Date.now() < waitUntil){
        // busy wait
        }
    }
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"](LOCK_FILE, String(process.pid));
    return true;
};
const releaseLock = ()=>{
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](LOCK_FILE)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["unlinkSync"](LOCK_FILE);
    }
};
const getTasks = ()=>{
    ensureDir();
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](TASKS_FILE)) {
        return [];
    }
    try {
        const data = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](TASKS_FILE, 'utf-8');
        const tasks = JSON.parse(data);
        return Array.isArray(tasks) ? tasks : [];
    } catch (error) {
        console.error('Error reading tasks:', error);
        return [];
    }
};
const saveTasks = (tasks)=>{
    ensureDir();
    if (!acquireLock()) {
        console.error('Failed to acquire lock for saving tasks');
        throw new Error('Failed to acquire lock');
    }
    try {
        // Write to temp file first, then rename (atomic operation)
        const tempFile = TASKS_FILE + '.tmp';
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"](tempFile, JSON.stringify(tasks, null, 2), 'utf-8');
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["renameSync"](tempFile, TASKS_FILE);
    } catch (error) {
        console.error('Error saving tasks:', error);
        throw error;
    } finally{
        releaseLock();
    }
};
const exportTasksToJson = (tasks)=>{
    return JSON.stringify(tasks, null, 2);
};
const importTasksFromJson = (json)=>{
    try {
        const tasks = JSON.parse(json);
        if (Array.isArray(tasks)) {
            return tasks;
        }
        return null;
    } catch  {
        return null;
    }
};
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:events [external] (node:events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:events", () => require("node:events"));

module.exports = mod;
}),
"[project]/src/lib/githubService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "commitImplementationStep",
    ()=>commitImplementationStep,
    "createDesignGitHubRepo",
    ()=>createDesignGitHubRepo,
    "createGitHubRepo",
    ()=>createGitHubRepo,
    "fetchDesignFromGitHub",
    ()=>fetchDesignFromGitHub,
    "updateGitHubRepo",
    ()=>updateGitHubRepo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$simple$2d$git$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/simple-git/dist/esm/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
const GIT_TEMP_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](process.cwd(), 'data', 'git-temp');
// Ensure temp directory exists
const ensureTempDir = ()=>{
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](GIT_TEMP_DIR)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"](GIT_TEMP_DIR, {
            recursive: true
        });
    }
};
// Generate SPEC.md content from task
const generateSpecContent = (task)=>{
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
`;
};
// Generate repo name from task title
const generateRepoName = (task)=>{
    const sanitized = task.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 50);
    return `dev-board-spec-${sanitized}`;
};
async function createGitHubRepo(task) {
    ensureTempDir();
    const repoName = generateRepoName(task);
    const repoDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](GIT_TEMP_DIR, repoName);
    // Clean up if exists
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](repoDir)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["rmSync"](repoDir, {
            recursive: true,
            force: true
        });
    }
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"](repoDir, {
        recursive: true
    });
    // Create SPEC.md
    const specContent = generateSpecContent(task);
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"](__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](repoDir, 'SPEC.md'), specContent, 'utf-8');
    // Initialize git
    const git = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$simple$2d$git$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(repoDir);
    await git.init();
    await git.addConfig('user.email', 'devboard@local');
    await git.addConfig('user.name', 'DevBoard');
    await git.add('.');
    await git.commit('Initial commit: Create SPEC.md');
    // Create GitHub repo using gh CLI
    const { execSync } = __turbopack_context__.r("[externals]/child_process [external] (child_process, cjs)");
    try {
        // Try to create the repo (may fail if it already exists)
        execSync(`gh repo create ${repoName} --private --source=. --push`, {
            cwd: repoDir,
            stdio: 'pipe'
        });
    } catch (error) {
        // If repo already exists, we need to handle differently
        // For now, let's try to push to existing repo or create with different name
        console.error('Repo creation error:', error.message);
        throw new Error(`Failed to create GitHub repo: ${error.message}`);
    }
    // Get the remote URL
    const remoteUrl = execSync(`git remote get-url origin`, {
        cwd: repoDir,
        encoding: 'utf-8'
    }).trim();
    // Convert SSH URL to HTTPS URL if needed
    let httpsUrl = remoteUrl;
    if (remoteUrl.startsWith('git@github.com:')) {
        httpsUrl = remoteUrl.replace('git@github.com:', 'https://github.com/');
    }
    // Clean up temp directory
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["rmSync"](repoDir, {
        recursive: true,
        force: true
    });
    return httpsUrl;
}
async function updateGitHubRepo(task, repoUrl) {
    ensureTempDir();
    // Extract repo name from URL
    const urlParts = repoUrl.replace('https://github.com/', '').replace('.git', '').split('/');
    const repoName = urlParts.pop() || '';
    const owner = urlParts.pop() || '';
    const repoDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](GIT_TEMP_DIR, `${repoName}-update`);
    // Clean up if exists
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](repoDir)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["rmSync"](repoDir, {
            recursive: true,
            force: true
        });
    }
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"](repoDir, {
        recursive: true
    });
    const { execSync } = __turbopack_context__.r("[externals]/child_process [external] (child_process, cjs)");
    try {
        // Clone the existing repo
        execSync(`gh repo clone ${owner}/${repoName} .`, {
            cwd: repoDir,
            stdio: 'pipe'
        });
    } catch (error) {
        console.error('Repo clone error:', error.message);
        // Try to use the existing remote if clone fails
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["rmSync"](repoDir, {
            recursive: true,
            force: true
        });
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"](repoDir, {
            recursive: true
        });
        // Initialize fresh and add remote
        const git = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$simple$2d$git$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(repoDir);
        await git.init();
        await git.addRemote('origin', repoUrl);
    }
    // Update SPEC.md
    const specContent = generateSpecContent(task);
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"](__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](repoDir, 'SPEC.md'), specContent, 'utf-8');
    // Commit and push
    const git = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$simple$2d$git$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(repoDir);
    await git.add('.');
    await git.commit('Update SPEC.md: userRequirement changed');
    await git.push();
    // Clean up
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["rmSync"](repoDir, {
        recursive: true,
        force: true
    });
}
// ============= Design Repo Functions =============
// Generate DESIGN.md content using AI (simulated - will be replaced with actual AI call)
const generateDesignContent = async (task)=>{
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
`;
    return designDoc;
};
// Generate design repo name
const generateDesignRepoName = (task)=>{
    const sanitized = task.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').substring(0, 50);
    return `dev-board-design-${sanitized}`;
};
async function createDesignGitHubRepo(task) {
    ensureTempDir();
    const repoName = generateDesignRepoName(task);
    const repoDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](GIT_TEMP_DIR, repoName);
    // Clean up if exists
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](repoDir)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["rmSync"](repoDir, {
            recursive: true,
            force: true
        });
    }
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"](repoDir, {
        recursive: true
    });
    // Generate design content
    const designContent = await generateDesignContent(task);
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"](__TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](repoDir, 'DESIGN.md'), designContent, 'utf-8');
    // Initialize git
    const git = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$simple$2d$git$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(repoDir);
    await git.init();
    await git.addConfig('user.email', 'devboard@local');
    await git.addConfig('user.name', 'DevBoard');
    await git.add('.');
    await git.commit('Initial commit: Create DESIGN.md');
    // Create GitHub repo using gh CLI
    const { execSync } = __turbopack_context__.r("[externals]/child_process [external] (child_process, cjs)");
    try {
        execSync(`gh repo create ${repoName} --private --source=. --push`, {
            cwd: repoDir,
            stdio: 'pipe'
        });
    } catch (error) {
        console.error('Design repo creation error:', error.message);
        throw new Error(`Failed to create design GitHub repo: ${error.message}`);
    }
    // Get the remote URL
    const remoteUrl = execSync(`git remote get-url origin`, {
        cwd: repoDir,
        encoding: 'utf-8'
    }).trim();
    // Convert SSH URL to HTTPS URL if needed
    let httpsUrl = remoteUrl;
    if (remoteUrl.startsWith('git@github.com:')) {
        httpsUrl = remoteUrl.replace('git@github.com:', 'https://github.com/');
    }
    // Clean up temp directory
    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["rmSync"](repoDir, {
        recursive: true,
        force: true
    });
    return httpsUrl;
}
async function fetchDesignFromGitHub(designRepoUrl) {
    ensureTempDir();
    const tempDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](GIT_TEMP_DIR, 'design-fetch-temp');
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](tempDir)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["rmSync"](tempDir, {
            recursive: true,
            force: true
        });
    }
    const { execSync } = __turbopack_context__.r("[externals]/child_process [external] (child_process, cjs)");
    try {
        // Extract owner and repo from URL
        const urlParts = designRepoUrl.replace('https://github.com/', '').replace('.git', '').split('/');
        const owner = urlParts[0];
        const repo = urlParts[1];
        // Use gh repo clone to get the content
        execSync(`gh repo clone ${owner}/${repo} temp`, {
            cwd: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](process.cwd(), 'data'),
            stdio: 'pipe'
        });
        // Read DESIGN.md
        const designPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](tempDir, 'DESIGN.md');
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](designPath)) {
            throw new Error('DESIGN.md not found in repository');
        }
        const content = __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["readFileSync"](designPath, 'utf-8');
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["rmSync"](tempDir, {
            recursive: true,
            force: true
        });
        return content;
    } catch (error) {
        console.error('Error fetching design:', error.message);
        throw new Error(`Failed to fetch design: ${error.message}`);
    }
}
async function commitImplementationStep(designRepoUrl, stepNumber, stepDescription, files) {
    ensureTempDir();
    const tempDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](GIT_TEMP_DIR, 'design-impl-temp');
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](tempDir)) {
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["rmSync"](tempDir, {
            recursive: true,
            force: true
        });
    }
    const { execSync } = __turbopack_context__.r("[externals]/child_process [external] (child_process, cjs)");
    try {
        // Extract owner and repo from URL
        const urlParts = designRepoUrl.replace('https://github.com/', '').replace('.git', '').split('/');
        const owner = urlParts[0];
        const repo = urlParts[1];
        // Clone the repo
        execSync(`gh repo clone ${owner}/${repo} temp`, {
            cwd: __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](process.cwd(), 'data'),
            stdio: 'pipe'
        });
        // Write the files
        for (const [filePath, content] of Object.entries(files)){
            const fullPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["join"](tempDir, filePath);
            const dir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["dirname"](fullPath);
            if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["existsSync"](dir)) {
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["mkdirSync"](dir, {
                    recursive: true
                });
            }
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["writeFileSync"](fullPath, content, 'utf-8');
        }
        // Commit and push
        const git = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$simple$2d$git$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(tempDir);
        await git.add('.');
        await git.commit(`feat: step ${stepNumber} - ${stepDescription}`);
        await git.push();
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["rmSync"](tempDir, {
            recursive: true,
            force: true
        });
    } catch (error) {
        console.error('Error committing implementation step:', error.message);
        throw new Error(`Failed to commit implementation step: ${error.message}`);
    }
}
}),
"[project]/src/app/api/specs/design/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/storage.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$githubService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/githubService.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { taskId } = body;
        if (!taskId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Task ID is required'
            }, {
                status: 400
            });
        }
        const tasks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTasks"])();
        const taskIndex = tasks.findIndex((t)=>t.id === taskId);
        if (taskIndex === -1) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Task not found'
            }, {
                status: 404
            });
        }
        const task = tasks[taskIndex];
        // Check if task has specRepoUrl (requires spec to be generated first)
        if (!task.specRepoUrl && !task.repoUrl) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Please generate the specification first before creating system design.'
            }, {
                status: 400
            });
        }
        // Check if design repo already exists
        if (task.designRepoUrl) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Design repository already exists',
                designRepoUrl: task.designRepoUrl
            }, {
                status: 400
            });
        }
        let designRepoUrl;
        try {
            console.log(`Creating design GitHub repo for task: ${task.title}`);
            designRepoUrl = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$githubService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createDesignGitHubRepo"])(task);
            console.log(`Created design repo: ${designRepoUrl}`);
        } catch (githubError) {
            console.error('GitHub design operation failed:', githubError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: `GitHub operation failed: ${githubError instanceof Error ? githubError.message : 'Unknown error'}`
            }, {
                status: 500
            });
        }
        // Update task with designRepoUrl and designStatus
        tasks[taskIndex] = {
            ...task,
            designRepoUrl,
            designStatus: 'completed',
            updatedAt: new Date().toISOString()
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["saveTasks"])(tasks);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            designRepoUrl
        });
    } catch (error) {
        console.error('Error generating design:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to generate design'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__d528e9cb._.js.map
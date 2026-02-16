# DevBoard - 開發任務管理看板系統

## 1. 專案架構

```
dev-board/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 根佈局（含 ThemeProvider）
│   │   ├── page.tsx            # 主看板頁面
│   │   ├── globals.css         # 全域樣式
│   │   └── api/                # API 路由
│   │       └── tasks/          # 任務 API
│   │           ├── route.ts    # GET/POST 任務
│   │           └── [id]/       # PUT/DELETE 單一任務
│   ├── components/            # React 元件
│   │   ├── Board.tsx           # 看板容器
│   │   ├── Column.tsx          # 看板欄位
│   │   ├── TaskCard.tsx        # 任務卡片
│   │   ├── TaskModal.tsx       # 新增/編輯任務 Modal
│   │   ├── Header.tsx          # 頂部導航
│   │   ├── FilterBar.tsx       # 篩選工具列
│   │   └── ThemeToggle.tsx     # 主題切換
│   ├── lib/                    # 工具函數
│   │   ├── storage.ts          # LocalStorage 封裝
│   │   └── types.ts            # TypeScript 類型定義
│   └── hooks/                  # React Hooks
│       └── useTasks.ts         # 任務狀態管理
├── public/                     # 靜態資源
├── data/
│   └── tasks.json              # JSON 數據文件（可選備份）
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.ts          # Tailwind 配置
└── postcss.config.js
```

## 2. 技術棧

- **框架**: Next.js 14+ (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS + CSS Variables
- **狀態管理**: React useState + LocalStorage
- **數據存儲**: LocalStorage（主要）+ JSON 文件（備份）
- **圖標**: Lucide React

## 3. 數據模型

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface TaskFilter {
  search: string;
  priority: string | null;
  tags: string[];
}
```

## 4. UI/UX 設計

### 4.1 配色方案

**Light Theme:**
- Background: `#f8fafc` (slate-50)
- Surface: `#ffffff`
- Primary: `#3b82f6` (blue-500)
- Border: `#e2e8f0` (slate-200)

**Dark Theme:**
- Background: `#0f172a` (slate-900)
- Surface: `#1e293b` (slate-800)
- Primary: `#60a5fa` (blue-400)
- Border: `#334155` (slate-700)

### 4.2 優先級顏色

- High: `#ef4444` (red-500)
- Medium: `#f59e0b` (amber-500)
- Low: `#22c55e` (green-500)

### 4.3 欄位顏色

- Todo: `#64748b` (slate-500)
- In Progress: `#3b82f6` (blue-500)
- Done: `#22c55e` (green-500)

## 5. 功能清單

### 5.1 任務管理
- [x] 建立新任務（標題、描述、優先級、標籤）
- [x] 編輯現有任務
- [x] 刪除任務（確認對話框）
- [x] 拖曳任務到不同欄位（可選：提升功能）

### 5.2 看板視圖
- [x] 三個欄位：Todo / In Progress / Done
- [x] 卡片式任務顯示
- [x] 欄位任務計數

### 5.3 篩選與搜尋
- [x] 文字搜尋（標題+描述）
- [x] 優先級篩選
- [x] 標籤篩選

### 5.4 主題
- [x] 淺色/深色主題切換
- [x] 主題偏好保存

### 5.5 數據持久化
- [x] LocalStorage 自動保存
- [x] JSON 導出/導入（可選）

## 6. API 設計

### GET /api/tasks
返回所有任務

### POST /api/tasks
創建新任務
```json
{
  "title": "string",
  "description": "string",
  "priority": "low|medium|high",
  "tags": ["string"]
}
```

### PUT /api/tasks/[id]
更新任務

### DELETE /api/tasks/[id]
刪除任務

## 7. 部署指令

```bash
# 1. 安裝依賴
npm install

# 2. 運行開發伺服器
npm run dev

# 3. 訪問 http://localhost:3000
```

## 8. 驗收標準

- [ ] 看板三欄位正確顯示
- [ ] 可新增、編輯、刪除任務
- [ ] 搜尋功能正常工作
- [ ] 優先級篩選正常運作
- [ ] 主題切換正常運作
- [ ] 數據在刷新後保留
- [ ] 響應式設計在移動端正常

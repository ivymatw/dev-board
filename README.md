# DevBoard - 開發任務管理看板系統

一個本地部署的開發任務管理看板系統，採用 Next.js + TypeScript + Tailwind CSS 開發。

![DevBoard](./docs/screenshot.png)

## 功能特點

- 📋 **看板視圖**：支援 Todo / In Progress / Done 三個欄位
- ➕ **任務管理**：建立、編輯、刪除任務
- 🏷️ **標籤系統**：支援多標籤分類
- 🔍 **搜尋篩選**：支援文字搜尋、優先級篩選、標籤篩選
- 🌙 **主題切換**：支援淺色/深色主題
- 💾 **數據持久化**：JSON 檔案本地儲存
- 📱 **響應式設計**：支援桌面和移動設備

## 技術棧

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **圖標**: Lucide React
- **數據存儲**: JSON 檔案（`data/tasks.json`）

## 安裝與運行

### 前置需求

- Node.js 18.17.0 或更高版本
- npm 或 yarn

### 安裝步驟

```bash
# 1. 進入專案目錄
cd dev-board

# 2. 安裝依賴
npm install

# 3. 運行開發伺服器
npm run dev
```

### 訪問應用

打開瀏覽器訪問：http://localhost:3000

## 數據管理

### 數據存儲

任務數據保存在 `data/tasks.json` 檔案中。

系統使用檔案鎖定機制確保並發存取時資料不會損壞。

### 數據結構

```json
[
  {
    "id": "uuid",
    "title": "任務標題",
    "description": "任務描述",
    "priority": "low|medium|high",
    "status": "todo|in-progress|done",
    "tags": ["標籤1", "標籤2"],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## 開機自動啟動（macOS Launchd）

### 安裝 Service

```bash
# 1. 複製 plist 到 Launchd 目錄
cp com.devboard.plist ~/Library/LaunchAgents/

# 2. 載入 service
launchctl load ~/Library/LaunchAgents/com.devboard.plist

# 3. 驗證服務狀態
launchctl list | grep devboard
```

### 解除安裝 Service

```bash
# 1. 卸載 service
launchctl unload ~/Library/LaunchAgents/com.devboard.plist

# 2. 刪除 plist 檔案
rm ~/Library/LaunchAgents/com.devboard.plist
```

### 日誌查看

服務日誌位於：
- 標準輸出：`logs/devboard.log`
- 錯誤輸出：`logs/devboard.error.log`

```bash
# 查看即時日誌
tail -f logs/devboard.log
```

## 項目結構

```
dev-board/
├── data/                       # 數據目錄
│   └── tasks.json              # 任務數據檔案
├── logs/                       # 日誌目錄
│   ├── devboard.log            # 標準輸出日誌
│   └── devboard.error.log      # 錯誤輸出日誌
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 根佈局
│   │   ├── page.tsx            # 主頁面
│   │   ├── globals.css         # 全域樣式
│   │   └── api/                # API 路由
│   │       └── tasks/          # 任務 API
│   ├── components/            # React 元件
│   │   ├── Board.tsx           # 看板容器
│   │   ├── Column.tsx          # 看板欄位
│   │   ├── TaskCard.tsx        # 任務卡片
│   │   ├── TaskModal.tsx       # 任務Modal
│   │   ├── Header.tsx          # 頂部導航
│   │   ├── FilterBar.tsx       # 篩選工具列
│   │   └── ThemeToggle.tsx     # 主題切換
│   ├── lib/                    # 工具函數
│   │   ├── storage.ts          # JSON 檔案儲存
│   │   └── types.ts            # 類型定義
│   └── hooks/                  # React Hooks
│       └── useTasks.ts         # 任務狀態管理
├── com.devboard.plist          # Launchd 服務配置
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## API 端點

| 方法 | 端點 | 說明 |
|------|------|------|
| GET | /api/tasks | 獲取所有任務 |
| POST | /api/tasks | 創建新任務 |
| GET | /api/tasks/[id] | 獲取指定任務 |
| PUT | /api/tasks/[id] | 更新任務 |
| DELETE | /api/tasks/[id] | 刪除任務 |

## 授權

MIT License

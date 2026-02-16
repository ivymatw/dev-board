# DevBoard - 開發任務管理看板系統

一個本地部署的開發任務管理看板系統，採用 Next.js + TypeScript + Tailwind CSS 開發。

![DevBoard](./docs/screenshot.png)

## 功能特點

- 📋 **看板視圖**：支援 Todo / In Progress / Done 三個欄位
- ➕ **任務管理**：建立、編輯、刪除任務
- 🏷️ **標籤系統**：支援多標籤分類
- 🔍 **搜尋篩選**：支援文字搜尋、優先級篩選、標籤篩選
- 🌙 **主題切換**：支援淺色/深色主題
- 💾 **數據持久化**：使用 LocalStorage 自動保存
- 📱 **響應式設計**：支援桌面和移動設備

## 技術棧

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **圖標**: Lucide React
- **數據存儲**: LocalStorage

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

任務數據保存在瀏覽器的 LocalStorage 中，key 為 `dev-board-tasks`。

### 導出任務

可以在瀏覽器控制台執行以下代碼導出數據：

```javascript
const tasks = JSON.parse(localStorage.getItem('dev-board-tasks'));
console.log(JSON.stringify(tasks, null, 2));
```

## 項目結構

```
dev-board/
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
│   │   ├── storage.ts          # LocalStorage 封裝
│   │   └── types.ts            # 類型定義
│   └── hooks/                  # React Hooks
│       └── useTasks.ts         # 任務狀態管理
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
| PUT | /api/t | 更新任務asks/[id] |
| DELETE | /api/tasks/[id] | 刪除任務 |

## 授權

MIT License

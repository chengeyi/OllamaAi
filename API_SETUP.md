# Vue AI Chat 應用

一個使用 Vue 3 + OpenAI API 的即時對話應用。

## 🚀 功能

- ✅ Vue 3 + TypeScript SFC 前端
- ✅ OpenAI GPT 模型集成
- ✅ 實時對話介面
- ✅ 動畫效果（基於 Vue Skills）
- ✅ Express 後端 API 中間層
- ✅ 錯誤處理與載入狀態

## 📋 前置條件

1. **Node.js** (v18+)
2. **OpenAI API Key** - [取得方式](https://platform.openai.com/api-keys)

## 🛠️ 安裝步驟

### 1. 安裝依賴
```bash
npm install
```

### 2. 配置 OpenAI API Key

編輯 `.env` 檔案，將你的 API Key 替換：

```env
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_API_KEY_HERE
OPENAI_MODEL=gpt-3.5-turbo
PORT=3001
```

⚠️ **重要**：不要提交 `.env` 檔案到 git！它已在 `.gitignore` 中。

### 3. 取得 OpenAI API Key

1. 前往 [OpenAI Platform](https://platform.openai.com/)
2. 登入或創建帳號
3. 進入 [API Keys 頁面](https://platform.openai.com/api-keys)
4. 點擊 "Create new secret key"
5. 複製生成的 key，貼到 `.env` 中

## 🎯 開發模式

### 方法 1：同時執行前後端（推薦）
```bash
npm run dev:all
```

這會同時啟動：
- 前端開發伺服器：http://localhost:5173
- 後端 API 伺服器：http://localhost:3001

### 方法 2：分別執行

終端 1 - 啟動後端 API：
```bash
npm run server
```

終端 2 - 啟動前端開發伺服器：
```bash
npm run dev
```

## 📖 使用方式

1. 開啟瀏覽器 http://localhost:5173
2. 點擊「💬 打開 AI 對話」按鈕
3. 在輸入框輸入問題，按 Enter 或點擊「發送」
4. AI 會透過 OpenAI API 生成回應

## 🏗️ 專案結構

```
src/
├── components/
│   ├── ChatWindow.vue       # 對話介面元件
│   └── HelloWorld.vue       # 示例元件
├── composables/
│   ├── useChat.ts           # 對話邏輯（API 整合）
│   └── useAnimation.ts      # 動畫狀態管理
├── App.vue                  # 主應用元件
└── main.ts                  # 入口點

server.ts                     # Express 後端 API
.env                          # 環境變數（API Key）
.env.local                    # 前端環境變數
```

## 🔧 API 端點

### POST /api/chat

發送對話訊息並獲得 AI 回應。

**請求格式：**
```json
{
  "messages": [
    { "role": "user", "content": "你好" },
    { "role": "assistant", "content": "你好！我是 AI 助手..." }
  ]
}
```

**回應格式：**
```json
{
  "success": true,
  "message": "AI 的回應內容",
  "model": "gpt-3.5-turbo",
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20
  }
}
```

## ⚠️ 常見問題

### 1. "API Key 無效" 錯誤
- 確認 `.env` 中的 OPENAI_API_KEY 正確無誤
- 重啟後端伺服器
- 檢查 API Key 是否過期或已刪除

### 2. "API 請求過於頻繁"
- OpenAI API 有速率限制
- 稍待片刻後重試
- 檢查帳户的額度是否已用完

### 3. 後端伺服器無法啟動
- 確認 port 3001 未被佔用
- 檢查是否已安裝所有依賴：`npm install`

### 4. 前端無法連接後端
- 確認後端伺服器正在運行（查看 http://localhost:3001/health）
- 檢查 `.env.local` 中的 VITE_OPENAI_API_URL

## 💳 成本估算

- **新帳戶**：免費試用 $5 額度（通常足夠測試）
- **付費帳戶**：每 1K prompt tokens 約 $0.0005 (GPT-3.5-turbo)
- **預估成本**：100 次對話 ≈ $0.01-0.05

## 🎨 Vue Skills 應用

本專案應用了以下 Vue Skill：

- **Animation Class-based Techniques**（`useAnimation.ts`）：用於對話視窗的進場/清除動畫
- **Composable Pattern**（`useChat.ts`、`useAnimation.ts`）：可重用邏輯抽象

## 📚 相關資源

- [Vue 3 文檔](https://vuejs.org/)
- [OpenAI API 文檔](https://platform.openai.com/docs)
- [Express.js 文檔](https://expressjs.com/)

## 📝 許可證

MIT

# 🦙 Ollama 快速開始（5 分鐘）

## 前提條件

你的電腦上需要有 **Ollama** 已安裝。

## 3 個步驟啟動應用

### 步驟 1️⃣：下載 AI 模型（首次 5-10 分鐘）

在終端執行：

```bash
ollama pull llama2
```

### 步驟 2️⃣：啟動 Ollama 伺服器

在 **新終端** 執行：

```bash
ollama serve
```

**保持此終端開啟**，你應該看到：
```
Listening on 127.0.0.1:11434
```

### 步驟 3️⃣：啟動 Vue AI 應用

在 **另一個終端** 執行：

```bash
cd /Users/pla-tony-mbp/Desktop/vueAi/vuwAi
npm run dev:all
```

## 🌐 打開應用

瀏覽器打開：

```
http://localhost:5173
```

點擊「💬 打開 AI 對話」開始聊天！

---

## 🛠️ 常見問題

| 問題 | 解決 |
|------|------|
| 「Ollama 伺服器未運行」| 執行 `ollama serve` |
| 「無法下載模型」| 檢查網路，執行 `ollama pull llama2` |
| 對話很慢 | 試試 `ollama pull mistral`（更快） |
| 記憶體不足 | 使用 `ollama pull orca-mini`（最輕量） |

詳細說明見 `OLLAMA_SETUP.md`

---

祝使用愉快！🦙

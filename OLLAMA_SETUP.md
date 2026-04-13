# 🦙 Ollama 本地 AI 設置指南

本應用已改為使用 **Ollama**，完全本地運行，無需任何 API Key！

## ✨ 為什麼選擇 Ollama？

| 特性 | Ollama | Google Gemini | OpenAI |
|------|--------|---------------|--------|
| 成本 | 🆓 **完全免費** | 🆓 免費額度 | 💳 需付費 |
| 隱私 | 🔒 **完全離線** | 雲端 | 雲端 |
| 網路 | 📴 **無需網路** | 需要網路 | 需要網路 |
| API Key | ❌ **無需** | ✅ 需要 | ✅ 需要 |
| 速度 | ⭐⭐⭐ 本地快速 | ⭐⭐⭐⭐ 雲端 | ⭐⭐⭐⭐⭐ 最快 |

---

## 🚀 5 分鐘快速設置

### 第 1 步：安裝 Ollama（一次性）

👉 **下載並安裝：https://ollama.com/download**

選擇你的作業系統：
- 🍎 **macOS** 
- 🪟 **Windows**
- 🐧 **Linux**

安裝完後，應該會在系統中看到 Ollama 圖標。

### 第 2 步：下載 AI 模型

在終端執行以下命令（首次下載可能需要 5-10 分鐘，取決於網速）：

```bash
# 推薦：輕量級但聰明的模型（預設）
ollama pull llama2

# 或選擇其他模型
ollama pull mistral       # 更快
ollama pull neural-chat   # 針對對話優化
ollama pull dolphin-mixtral  # 更強大（需要 8GB+ 記憶體）
```

### 第 3 步：啟動 Ollama 伺服器

在 **新的終端視窗** 執行：

```bash
ollama serve
```

你應該會看到：
```
2024/04/13 12:00:00 Listening on 127.0.0.1:11434 (version x.x.x)
```

**保持此終端視窗開啟**（不要關閉）！

### 第 4 步：啟動 Vue AI 應用

在 **另一個終端視窗** 執行：

```bash
npm run dev:all
```

你會看到：
```
🚀 Ollama AI 伺服器啟動於: http://localhost:3001
📊 配置信息:
   Ollama API URL: http://localhost:11434
   使用模型: llama2
```

### 第 5 步：開始使用

打開瀏覽器：**http://localhost:5173**

1. 點擊「💬 打開 AI 對話」
2. 輸入問題
3. AI 會本地回答！

---

## 🎯 常見 AI 模型

| 模型 | 大小 | 速度 | 品質 | 推薦用途 |
|------|------|------|------|---------|
| **llama2** | 4GB | ⭐⭐⭐ | ⭐⭐⭐ | 📝 **默認推薦** |
| mistral | 4GB | ⭐⭐⭐⭐ | ⭐⭐ | ⚡ 快速回應 |
| neural-chat | 5GB | ⭐⭐⭐ | ⭐⭐⭐ | 💬 對話專用 |
| dolphin-mixtral | 26GB | ⭐⭐ | ⭐⭐⭐⭐⭐ | 🧠 高級對話 |
| openhermes | 7GB | ⭐⭐ | ⭐⭐⭐⭐ | 💡 邏輯推理 |

### 切換模型

編輯 `.env` 檔案：

```env
OLLAMA_MODEL=mistral
```

或運行：

```bash
ollama pull mistral
```

---

## ⚙️ 配置說明

### `.env` 文件

```env
# Ollama 伺服器地址（預設本地）
OLLAMA_API_URL=http://localhost:11434

# 使用的 AI 模型（預設 llama2）
OLLAMA_MODEL=llama2

# 後端 API 埠
PORT=3001
```

### 修改其他配置（可選）

編輯 `server.ts` 的第 16-17 行來修改默認值。

---

## 🆘 故障排除

### ❌ 問題 1：「Ollama 伺服器未運行」

**解決**：
1. 確保已執行 `ollama serve`
2. 終端應顯示 `Listening on 127.0.0.1:11434`
3. 不要關閉此終端視窗

### ❌ 問題 2：「無法下載模型」

**解決**：
```bash
# 檢查網路連接
ollama list

# 重新下載
ollama pull llama2

# 查看可用模型
ollama list
```

### ❌ 問題 3：「記憶體不足」

如果收到記憶體錯誤：
1. 使用較小的模型：`ollama pull mistral`
2. 或關閉其他應用釋放記憶體
3. 檢查系統可用記憶體：
   - Mac: `top`
   - Windows: 工作管理員

### ❌ 問題 4：「對話回應很慢」

**解決**：
1. 使用更輕量的模型（mistral 比 llama2 快）
2. 檢查系統資源使用：`ollama list` 查看模型大小
3. 關閉其他應用

---

## 📚 所有可用模型

查看完整模型列表：

```bash
ollama pull mistral        # 7B 模型，速度最快
ollama pull llama2         # 7B 模型（預設）
ollama pull neural-chat    # 7B 模型，對話優化
ollama pull openchat       # 7B 模型
ollama pull zephyr         # 7B 模型
ollama pull orca-mini      # 3B 模型，極輕量
ollama pull dolphin-mixtral # 46B 模型，非常聰明（需要 32GB+ RAM）
```

完整列表：https://ollama.com/library

---

## 🔧 進階配置

### 遠端連接

如果要從其他電腦連接 Ollama：

```bash
# 在 Ollama 所在電腦上啟動（允許外部連接）
OLLAMA_HOST=0.0.0.0:11434 ollama serve

# 在 .env 中修改
OLLAMA_API_URL=http://192.168.1.100:11434
```

### 使用 Docker

```bash
docker pull ollama/ollama
docker run -d -p 11434:11434 --name ollama ollama/ollama
ollama pull llama2
```

---

## 📊 效能提示

### 提升速度

1. **使用 GPU**（如有）
   - Ollama 會自動檢測並使用 GPU
   - Mac 自動支持 Metal 加速
   - 需要 NVIDIA/AMD GPU 驅動支持

2. **減少上下文長度**
   - 新對話速度更快
   - 使用「清除對話」按鈕

3. **選擇輕量模型**
   - mistral: 最快
   - orca-mini: 最輕量

### 節省記憶體

```bash
# 只載入必要的模型
ollama rm llama2  # 刪除不用的模型
ollama list       # 查看已安裝模型
```

---

## 🎉 成功！

現在你有了一個**完全本地的、隱私友好的、無需 API Key 的 AI 應用**！

---

## 📞 常見問題

**Q: 一定要用 Ollama 嗎？**
A: 不一定。你也可以改回 Google Gemini 或 OpenAI，取決於你的偏好。

**Q: 模型會佔用多少空間？**
A: llama2 約 4GB，mistral 約 4GB，dolphin-mixtral 約 26GB。

**Q: 網路連接會被 Ollama 傳送？**
A: 不會。Ollama 完全運行在本地，不會傳送任何數據到外部伺服器。

**Q: 可以在線上部署嗎？**
A: 可以，但需要安裝 Ollama。建議用於開發/演示環境。

---

## 🚀 下一步

- 試試不同的模型
- 調整回應溫度（`.env` 中的 `temperature` 參數）
- 分享給朋友！

祝你使用愉快！🦙

# 🆓 Google Gemini 免費 AI 設置指南

本應用已改為使用 **Google Gemini**，完全免費，無需信用卡！

## ✨ 為什麼選擇 Gemini？

| 特性 | Gemini | OpenAI |
|------|--------|--------|
| 成本 | 🆓 **完全免費** | 💳 需要信用卡 |
| 額度 | 每分鐘 60 請求 | 付費 |
| 品質 | ⭐⭐⭐⭐⭐ 接近 GPT-4 | ⭐⭐⭐⭐⭐ 最佳 |
| API Key 取得 | ⚡ 1 分鐘 | 📋 需要審核 |
| 設置難度 | 簡單 | 中等 |

---

## 🚀 3 分鐘快速設置

### 第 1 步：取得免費 API Key（無需信用卡）

1. 開啟瀏覽器：https://aistudio.google.com/apikey
2. 登入 Google 帳號（如無帳號請先註冊）
3. 點擊 **「Create API Key」**（藍色按鈕）
4. 選擇 **「Create API key in new project」**
5. API Key 會自動複製到剪貼簿，形式如：`AIzaSyD...`

> ⏱️ **整個過程只需 1-2 分鐘！**

### 第 2 步：配置環境變數

編輯 `.env` 檔案，將你的 API Key 填入：

```env
GEMINI_API_KEY=AIzaSyD...把你的Key貼在這裡
PORT=3001
GEMINI_MODEL=gemini-1.5-flash
```

**注意**：`.env` 已在 `.gitignore` 中，不會被提交到 Git

### 第 3 步：啟動應用

```bash
npm run dev:all
```

等待看到：
```
✅ Gemini API Key 已配置
🎉 使用完全免費的 Google Gemini API！
```

### 第 4 步：開始聊天

打開瀏覽器：http://localhost:5173

1. 點擊「💬 打開 AI 對話」
2. 輸入問題
3. AI 會即時回應！

---

## 📊 Gemini 模型選項

本應用預設使用 **`gemini-1.5-flash`**（速度快，完全免費）

如想使用其他模型，編輯 `.env`：

```env
# 推薦（預設）：速度快，完全免費
GEMINI_MODEL=gemini-1.5-flash

# 更聰明但略慢（仍完全免費）
GEMINI_MODEL=gemini-1.5-pro

# 舊版本（也是免費）
GEMINI_MODEL=gemini-1.0-pro
```

---

## 💬 常見問題

### Q1: 真的完全免費嗎？
**A:** 是的！Google Gemini 有永久免費額度：
- 每分鐘最多 60 個 API 請求
- 每天最多 1500 個請求
- 無需信用卡，永遠免費

### Q2: API Key 會過期嗎？
**A:** 不會。一旦創建，API Key 將永久有效，除非你手動刪除。

### Q3: 回應品質如何？
**A:** `gemini-1.5-flash` 的品質接近 GPT-3.5-turbo，`gemini-1.5-pro` 接近 GPT-4。

### Q4: 如何刪除或重新生成 API Key？
**A:** 回到 https://aistudio.google.com/apikey，點擊 Key 旁的刪除按鈕，然後創建新的。

### Q5: 我擔心隱私問題
**A:** 
- 對話數據不會被 Google 用於訓練
- 你可以檢查 [Gemini API 隱私政策](https://ai.google.dev/privacy-and-terms)
- 不會儲存個人信息

---

## 🔄 從 OpenAI 切換回 Gemini

如果之前設置過 OpenAI，現在改用 Gemini 後端：

1. `.env` 已自動更新為 Gemini 配置
2. `server.ts` 已改為使用 Google Generative AI SDK
3. `useChat.ts` 無需修改（API 介面相同）

重啟應用即可：
```bash
npm run dev:all
```

---

## 🆘 故障排除

### 問題 1：`GEMINI_API_KEY not found`
**解決**：
- 確認 `.env` 文件中有 `GEMINI_API_KEY=` 這一行
- 確認 API Key 不為空
- 重啟伺服器

### 問題 2：`401 Unauthorized`
**解決**：
- 複製的 API Key 可能有空格，請重新檢查
- 嘗試在 https://aistudio.google.com/apikey 刪除舊 Key，創建新 Key

### 問題 3：`429 Too Many Requests`
**解決**：
- 超過免費額度限制（每分鐘 60 請求）
- 等待 1 分鐘後重試

### 問題 4：後端無法啟動
**解決**：
```bash
# 確保依賴已安裝
npm install

# 清除 node_modules 並重新安裝（如仍有問題）
rm -rf node_modules
npm install
```

---

## 📈 升級到付費版（可選）

如果超過免費額度，可升級到 Google One AI Premium（約 $20/月），獲得：
- 更高的 API 額度
- 優先支持

但本應用可完全使用免費版本！

---

## 🎉 成功！

現在你有了一個免費的 AI 對話應用，無需任何信用卡！

**下一步建議**：
- 📱 分享到你的朋友
- 🎨 自定義 UI 樣式
- 📚 嘗試不同的問題與對話模式

有問題嗎？檢查 terminal 日誌，確保看到：
```
✅ Gemini API Key 已配置
🎉 使用完全免費的 Google Gemini API！
```

---

## 📚 官方資源

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API 文檔](https://ai.google.dev/docs)
- [定價信息](https://ai.google.dev/pricing)

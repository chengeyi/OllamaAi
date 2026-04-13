# 🚀 快速開始（3 分鐘）

## 第 1 步：取得免費 API Key

👉 打開此連結：**https://aistudio.google.com/apikey**

1. 登入 Google 帳號
2. 點擊「Create API Key」
3. 選擇「Create API key in new project」
4. **複製生成的 Key**（自動複製到剪貼簿）

## 第 2 步：配置 API Key

編輯 `.env` 檔案：

```bash
# Mac/Linux
nano .env

# 或用任何編輯器打開
```

找到這一行：
```env
GEMINI_API_KEY=your-gemini-api-key-here
```

改為：
```env
GEMINI_API_KEY=AIzaSyD... (貼上你的 API Key)
```

保存檔案（Ctrl+X，然後按 Y）

## 第 3 步：啟動應用

```bash
npm run dev:all
```

等待看到：
```
✅ Gemini API Key 已配置
🎉 使用完全免費的 Google Gemini API！
```

## 第 4 步：開始使用

打開瀏覽器：**http://localhost:5173**

1. 點擊「💬 打開 AI 對話」
2. 輸入你的問題
3. AI 會回答！

---

## ✨ 就這麼簡單！

🎉 **恭喜！你現在有了一個完全免費的 AI 對話應用！**

---

## 📞 遇到問題？

- 檢查 `.env` 檔案是否正確配置
- 確保複製的 API Key 沒有多餘空格
- 檢查 terminal 輸出是否有錯誤訊息
- 詳細說明見 `GEMINI_FREE_SETUP.md`

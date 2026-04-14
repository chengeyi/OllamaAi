import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// 中間件
app.use(cors())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// 簡體中文到繁體中文的映射表
const simplified2Traditional: { [key: string]: string } = {
  '吗': '嗎', '这': '這', '那': '那', '里': '裡', '给': '給',
  '过': '過', '会': '會', '经': '經', '为': '為', '说': '說',
  '来': '來', '后': '後', '面': '面', '边': '邊',
  '从': '從', '让': '讓', '听': '聽', '见': '見', '道': '道',
  '学': '學', '已': '已', '们': '們', '我们': '我們', '你们': '你們',
  '他们': '他們', '她们': '她們', '哪': '哪', '对': '對',
  '却': '卻', '坏': '壞', '长': '長', '旧': '舊', '无': '無',
  '与': '與', '所': '所', '比': '比', '其': '其', '些': '些'
}

// 簡體轉繁體函數
function simplifiedToTraditional(text: string): string {
  let result = text
  for (const [simplified, traditional] of Object.entries(simplified2Traditional)) {
    const regex = new RegExp(simplified, 'g')
    result = result.replace(regex, traditional)
  }
  return result
}

// Ollama API 配置
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434'
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2'

// API 路由：對話端點
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '訊息格式錯誤' })
    }

    // 獲取最後一條使用者訊息
    const lastMessage = messages[messages.length - 1]
    const userMessage = lastMessage.content
    const imageData = lastMessage.imageData // 取得圖片 Base64 數據

    // 組合對話歷史為提示
    const conversationHistory = messages
      .slice(0, -1)
      .map((msg: any) => {
        const role = msg.role === 'user' ? 'User' : 'Assistant'
        return `${role}: ${msg.content}`
      })
      .join('\n')

    // 加入繁體中文系統指示
    const systemPrompt = `你是一個友善且聰慧的 AI 助手。
你必須完全用繁體中文回答。
不要使用簡體中文、拼音或英文。
始終用繁體中文的方式表達，例如：愛、國、學、語言等。`
    
    const fullPrompt = conversationHistory 
      ? `${systemPrompt}\n\n${conversationHistory}\nUser: ${userMessage}`
      : `${systemPrompt}\n\nUser: ${userMessage}`

    try {
      // 判斷是否有圖片，使用不同的 API 端點
      let apiEndpoint = `${OLLAMA_API_URL}/api/generate`
      let requestBody: any = {
        model: OLLAMA_MODEL,
        prompt: fullPrompt,
        stream: false,
        temperature: 0.7,
      }

      // 如果有圖片數據，添加到請求中
      if (imageData) {
        // 移除 Data URL 的前綴 (data:image/...;base64,)
        const base64Image = imageData.includes(',') 
          ? imageData.split(',')[1] 
          : imageData
        
        requestBody.images = [base64Image]
        console.log('📸 檢測到圖片，將發送給 AI 進行分析')
      }

      // 呼叫 Ollama API
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ollama API 錯誤 (${response.status}): ${errorText}`)
      }

      const data = await response.json() as any

      if (data.response) {
        const aiResponse = data.response.trim()
        // 將簡體中文轉換為繁體中文
        const traditionalResponse = simplifiedToTraditional(aiResponse)
        
        res.json({
          success: true,
          message: traditionalResponse,
          model: OLLAMA_MODEL,
          hasImage: !!imageData
        })
      } else {
        throw new Error('無法生成回應')
      }
    } catch (fetchError: any) {
      if (fetchError.message?.includes('ECONNREFUSED')) {
        return res.status(503).json({
          error: 'Ollama 伺服器未運行',
          details: `無法連接 ${OLLAMA_API_URL}。請確保 Ollama 已啟動。`,
          instruction: '運行: ollama serve'
        })
      }
      throw fetchError
    }
  } catch (error: any) {
    console.error('API 錯誤:', error)

    res.status(500).json({
      error: error.message || 'API 請求失敗',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    })
  }
})

// 健康檢查端點
app.get('/health', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/tags`)
    const isOllamaRunning = response.ok

    res.json({
      status: isOllamaRunning ? 'OK' : 'Ollama 未運行',
      message: 'Ollama API 伺服器運行中',
      model: OLLAMA_MODEL,
      ollamaUrl: OLLAMA_API_URL,
      ollamaStatus: isOllamaRunning ? '✅ 已連接' : '❌ 未連接',
      usingLocalAI: true
    })
  } catch (error: any) {
    res.json({
      status: 'Ollama 未運行',
      message: 'Ollama 伺服器未運行',
      model: OLLAMA_MODEL,
      ollamaUrl: OLLAMA_API_URL,
      ollamaStatus: '❌ 未連接',
      usingLocalAI: true,
      error: error.message
    })
  }
})

// 啟動伺服器
app.listen(port, () => {
  console.log(`\n🚀 Ollama AI 伺服器啟動於: http://localhost:${port}`)
  console.log(`📝 對話端點: POST http://localhost:${port}/api/chat`)
  console.log(`🏥 健康檢查: GET http://localhost:${port}/health\n`)

  console.log(`📊 配置信息:`)
  console.log(`   Ollama API URL: ${OLLAMA_API_URL}`)
  console.log(`   使用模型: ${OLLAMA_MODEL}`)
  console.log(`   完全本地運行，無需 API Key\n`)

  console.log('⚠️  重要提示:')
  console.log('   請確保 Ollama 已安裝並運行中')
  console.log('   1. 下載 Ollama: https://ollama.com/download')
  console.log(`   2. 下載模型: ollama pull ${OLLAMA_MODEL}`)
  console.log('   3. 啟動 Ollama: ollama serve\n')
})

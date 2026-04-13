import dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config()

async function testGeminiAPI() {
  console.log('\n🔍 Google Gemini API 診斷工具\n')
  console.log('=' .repeat(50))

  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    console.error('❌ 錯誤：未設置 GEMINI_API_KEY')
    console.log('📌 請在 .env 檔案中設置 GEMINI_API_KEY')
    return
  }

  console.log(`✅ API Key 已設置（前 20 字）: ${apiKey.substring(0, 20)}...`)
  console.log()

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    
    console.log('📊 嘗試連接 Gemini API...')
    console.log()

    // 嘗試使用 gemini-pro 模型
    console.log('1️⃣  測試模型: gemini-pro')
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      const result = await model.generateContent('Hello')
      console.log('   ✅ gemini-pro: 可用')
    } catch (err: any) {
      console.log(`   ❌ gemini-pro: ${err.message}`)
    }

    console.log()

    // 嘗試使用 gemini-1.5-pro 模型
    console.log('2️⃣  測試模型: gemini-1.5-pro')
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
      const result = await model.generateContent('Hello')
      console.log('   ✅ gemini-1.5-pro: 可用')
    } catch (err: any) {
      console.log(`   ❌ gemini-1.5-pro: ${err.message}`)
    }

    console.log()

    // 嘗試使用 gemini-1.5-flash 模型
    console.log('3️⃣  測試模型: gemini-1.5-flash')
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
      const result = await model.generateContent('Hello')
      console.log('   ✅ gemini-1.5-flash: 可用')
    } catch (err: any) {
      console.log(`   ❌ gemini-1.5-flash: ${err.message}`)
    }

    console.log()
    console.log('=' .repeat(50))
    console.log('\n💡 建議:')
    console.log('1. 如果所有模型都失敗，API Key 可能無效')
    console.log('2. 前往 https://aistudio.google.com/apikey 重新生成 API Key')
    console.log('3. 確保登入的是正確的 Google 帳號\n')

  } catch (error: any) {
    console.error('❌ 連接失敗:', error.message)
    console.log('\n🔧 故障排除:')
    console.log('1. 檢查網路連接')
    console.log('2. 確認 API Key 正確無誤')
    console.log('3. 嘗試重新生成 API Key: https://aistudio.google.com/apikey\n')
  }
}

testGeminiAPI()

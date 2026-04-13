import { ref, computed } from 'vue'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function useChat() {
  const messages = ref<Message[]>([])
  const inputValue = ref('')
  const isLoading = ref(false)
  const conversationId = ref(crypto.randomUUID())
  const error = ref<string | null>(null)

  const messageCount = computed(() => messages.value.length)
  const isEmpty = computed(() => messages.value.length === 0)

  function addMessage(content: string, role: 'user' | 'assistant') {
    const message: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date()
    }
    messages.value.push(message)
    return message
  }

  async function sendMessage(userMessage: string) {
    if (!userMessage.trim()) return

    // 清除之前的錯誤
    error.value = null

    // 新增使用者訊息
    addMessage(userMessage, 'user')
    inputValue.value = ''
    isLoading.value = true

    try {
      // 準備訊息列表（只發送必要的對話歷史）
      const chatHistory = messages.value.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))

      // 呼叫後端 API（Ollama）
      const apiUrl = 'http://localhost:3001/api/chat'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: chatHistory,
          conversationId: conversationId.value
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `API 請求失敗 (${response.status})`)
      }

      const data = await response.json()

      if (data.success && data.message) {
        addMessage(data.message, 'assistant')
      } else {
        throw new Error(data.error || '無法生成回應')
      }
    } catch (err: any) {
      const errorMessage = err.message || '發生未知錯誤'
      error.value = errorMessage
      console.error('Chat API Error:', err)

      // 新增錯誤訊息到對話
      addMessage(`❌ 錯誤: ${errorMessage}`, 'assistant')
    } finally {
      isLoading.value = false
    }
  }

  function clearChat() {
    messages.value = []
    conversationId.value = crypto.randomUUID()
    error.value = null
  }

  return {
    messages,
    inputValue,
    isLoading,
    conversationId,
    messageCount,
    isEmpty,
    error,
    addMessage,
    sendMessage,
    clearChat
  }
}

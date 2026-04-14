<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>AI 對話助手</h2>
      <button 
        v-if="!chat.isEmpty.value" 
        @click="handleClearChat"
        class="clear-btn"
        title="清除對話"
      >
        🗑️ 清除
      </button>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div v-if="chat.isEmpty.value" class="empty-state">
        <p>開始一段對話吧！</p>
        <small>輸入你的問題或想法...</small>
      </div>

      <div v-if="chat.error.value" class="error-banner">
        <span>⚠️ {{ chat.error.value }}</span>
      </div>
      
      <div
        v-for="message in chat.messages.value"
        :key="message.id"
        :class="['message', message.role]"
        :data-animate="true"
      >
        <div class="message-content">
          <span class="role-badge" :class="message.role">
            {{ message.role === 'user' ? '你' : 'AI' }}
          </span>
          <div class="message-bubble">
            <!-- 顯示圖片（如果有的話） -->
            <img v-if="message.imageData" :src="message.imageData" :alt="message.imageName" class="message-image" />
            <!-- 顯示文本內容 -->
            <p v-if="message.content">{{ message.content }}</p>
          </div>
        </div>
        <small class="timestamp">
          {{ formatTime(message.timestamp) }}
        </small>
      </div>

      <div v-if="chat.isLoading.value" class="loading-message">
        <div class="loading-spinner"></div>
        <p>AI 正在思考中...</p>
      </div>
    </div>

    <div class="chat-input-area">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleImageUpload"
        style="display: none"
      />
      <button
        @click="() => fileInput?.click()"
        :disabled="chat.isLoading.value"
        class="image-btn"
        title="上傳圖片"
      >
        🖼️ 圖片
      </button>
      <input
        v-model="chat.inputValue.value"
        type="text"
        placeholder="輸入你的問題..."
        :disabled="chat.isLoading.value || isRecording"
        class="chat-input"
        ref="inputRef"
        @keydown="handleKeydown"
        @compositionstart="isComposing = true"
        @compositionend="isComposing = false"
      />
      <button
        @click="toggleVoiceInput"
        :disabled="chat.isLoading.value"
        :class="{ recording: isRecording }"
        class="voice-btn"
        :title="isRecording ? '停止錄音' : '開始語音輸入'"
      >
        {{ isRecording ? '⏹️ 停止' : '🎤 語音' }}
      </button>
      <button
        @click="handleSendMessage"
        :disabled="(!chat.inputValue.value.trim() && !uploadedImage) || chat.isLoading.value"
        class="send-btn"
      >
        <span v-if="!chat.isLoading.value">發送</span>
        <span v-else>等待中...</span>
      </button>
    </div>

    <div v-if="uploadedImage" class="image-preview">
      <div class="preview-item">
        <img :src="uploadedImage" :alt="uploadedImageName" />
        <button @click="clearImage" class="remove-btn" title="移除圖片">✕</button>
      </div>
      <span class="preview-text">{{ uploadedImageName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useChat } from '@/composables/useChat'
import { useAnimation } from '@/composables/useAnimation'

const chat = useChat()
const messagesContainer = ref<HTMLElement>()
const { trigger: triggerClearAnimation } = useAnimation(300)

// 語音輸入相關
const isRecording = ref(false)
let recognition: any = null

// 圖片上傳相關
const fileInput = ref<HTMLInputElement>()
const uploadedImage = ref<string>('')
const uploadedImageName = ref<string>('')

// 處理圖片上傳
function handleImageUpload(event: Event) {
  console.log('📁 圖片上傳事件觸發:', event)
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || files.length === 0) return

  const file = files[0]
  console.log('📁 上傳的文件:', file)
  uploadedImageName.value = file.name

  // 檢查文件大小（限制為 5MB）
  if (file.size > 5 * 1024 * 1024) {
    chat.error.value = '圖片大小不能超過 5MB'
    return
  }

  // 讀取圖片為 Data URL
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    console.log('📁 圖片讀取完成:', e)
    if (e.target?.result) {
      uploadedImage.value = e.target.result as string
    }
  }
  reader.readAsDataURL(file)

  // 清空輸入框
  if (target) {
    target.value = ''
  }
}

// 移除圖片
function clearImage() {
  uploadedImage.value = ''
  uploadedImageName.value = ''
}

// 初始化語音識別
function initVoiceRecognition() {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  if (!SpeechRecognition) {
    alert('您的瀏覽器不支援語音識別功能')
    return
  }

  recognition = new SpeechRecognition()
  recognition.lang = 'zh-TW'
  recognition.continuous = false
  recognition.interimResults = true

  recognition.onstart = () => {
    isRecording.value = true
  }

  recognition.onresult = (event: any) => {
    let transcript = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript
    }
    chat.inputValue.value = transcript
  }

  recognition.onerror = (event: any) => {
    console.error('語音識別錯誤:', event.error)
    chat.error.value = `語音識別錯誤: ${event.error}`
  }

  recognition.onend = () => {
    isRecording.value = false
  }
}

function toggleVoiceInput() {
  if (!recognition) {
    initVoiceRecognition()
  }

  if (isRecording.value) {
    recognition.stop()
  } else {
    chat.inputValue.value = ''
    recognition.start()
  }
}

watch(
  () => chat.messages.value.length,
  async () => {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }
)

function handleSendMessage() {
  // inputRef.value?.blur()
  // 從 v-model 獲取輸入值
  const inputValue = chat.inputValue.value || ''
  const hasText = inputValue.trim()
  const hasImage = uploadedImage.value

  console.log('🔍 當前狀態:', { 
    inputValue, 
    inputValueLength: inputValue.length,
    hasText: !!hasText, 
    hasImage: !!hasImage,
    uploadedImageName: uploadedImageName.value 
  })

  if (!hasText && !hasImage) {
    console.warn('⚠️ 沒有文字也沒有圖片，退出發送')
    return
  }

  // 保存文本內容（在清空之前）
  const messageText = inputValue.trim()
  const imageData = uploadedImage.value
  const imageName = uploadedImageName.value

  console.log('📤 準備發送消息:', { 
    messageText: `"${messageText}"`,
    messageTextLength: messageText.length,
    hasImage: !!imageData, 
    imageName 
  })
  // return
  // 發送消息（可包含文本和圖片）
  chat.sendMessage(messageText, imageData, imageName)
  
  // 清空圖片
  clearImage()
}

function handleClearChat() {
  triggerClearAnimation()
  setTimeout(() => {
    chat.clearChat()
  }, 150)
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('zh-TW', {
    hour: '2-digit',
    minute: '2-digit'
  })
}


const isComposing = ref(false)

function handleKeydown(e: KeyboardEvent) {
  // 1️⃣ 還在輸入法組字 → 一律忽略
  if (isComposing.value) return

  // 2️⃣ 不是 Enter → 忽略
  if (e.key !== 'Enter') return

  // 3️⃣ Enter + Shift → 換行（可選）
  if (e.shiftKey) return

  e.preventDefault()
  handleSendMessage()
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a3f 0%, #0f0f23 100%);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(102, 126, 234, 0.15);
  overflow: hidden;
  animation: slideIn 0.4s ease-out;
  backdrop-filter: blur(10px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: rgba(102, 126, 234, 0.1);
  border-bottom: 1px solid rgba(102, 126, 234, 0.2);
  color: #e0e0e0;
}

.chat-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.15);
  color: #a8c5f8;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.clear-btn:hover {
  background: rgba(102, 126, 234, 0.25);
  border-color: rgba(102, 126, 234, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(15, 15, 35, 0.5);
}

.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(102, 126, 234, 0.05);
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #7a8ff5 0%, #8356b8 100%);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #8899cc;
  text-align: center;
}

.empty-state p {
  font-size: 1.125rem;
  margin: 0 0 0.5rem 0;
  color: #a8c5f8;
}

.empty-state small {
  color: #6b7fa0;
}

.error-banner {
  padding: 0.75rem 1rem;
  background: rgba(244, 67, 54, 0.15);
  border-left: 4px solid #f44;
  border-radius: 4px;
  color: #ff8a80;
  font-size: 0.875rem;
  animation: slideIn 0.3s ease-out;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: messageAppear 0.3s ease-out;
}

@keyframes messageAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  align-items: flex-end;
}

.message.assistant {
  align-items: flex-start;
}

.message-content {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  max-width: 85%;
}

.message.assistant .message-content {
  flex-direction: row;
}

.message.user .message-content {
  flex-direction: row-reverse;
}

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.role-badge.user {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.role-badge.assistant {
  background: rgba(102, 126, 234, 0.15);
  color: #a8c5f8;
}

.message p {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message.user p {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.message.assistant p {
  background: rgba(102, 126, 234, 0.1);
  color: #e0e0e0;
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-bottom-left-radius: 4px;
}

.message-bubble {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.message-image {
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  object-fit: cover;
  animation: messageAppear 0.3s ease-out;
}

.timestamp {
  font-size: 0.75rem;
  color: #6b7fa0;
  padding: 0 0.5rem;
}

.loading-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  color: #a8c5f8;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.chat-input-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(26, 26, 63, 0.8);
  border-top: 1px solid rgba(102, 126, 234, 0.2);
}

.chat-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  background: rgba(102, 126, 234, 0.05);
  color: #e0e0e0;
  transition: all 0.3s ease;
}

.chat-input::placeholder {
  color: #6b7fa0;
}

.chat-input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.15);
}

.chat-input:disabled {
  background: rgba(102, 126, 234, 0.05);
  color: #6b7fa0;
}

.send-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.send-btn:active:not(:disabled) {
  transform: translateY(0);
}

.send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.voice-btn {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.voice-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.voice-btn:active:not(:disabled) {
  transform: translateY(0);
}

.voice-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.voice-btn.recording {
  background: linear-gradient(135deg, #f44 0%, #ff6b6b 100%);
  animation: pulse-recording 1.5s ease-in-out infinite;
}

@keyframes pulse-recording {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(244, 67, 54, 0.3);
  }
}

.image-btn {
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.image-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.image-btn:active:not(:disabled) {
  transform: translateY(0);
}

.image-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.image-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 6px;
  margin-bottom: 0.75rem;
}

.preview-item {
  position: relative;
  flex-shrink: 0;
}

.preview-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid rgba(102, 126, 234, 0.3);
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #f44 0%, #ff6b6b 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.preview-text {
  flex: 1;
  color: #a8c5f8;
  font-size: 0.875rem;
  word-break: break-all;
}
</style>

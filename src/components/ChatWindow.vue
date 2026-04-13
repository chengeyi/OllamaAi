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
          <p>{{ message.content }}</p>
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
        v-model="chat.inputValue.value"
        @keydown.enter="handleSendMessage"
        type="text"
        placeholder="輸入你的問題..."
        :disabled="chat.isLoading.value"
        class="chat-input"
      />
      <button
        @click="handleSendMessage"
        :disabled="!chat.inputValue.value.trim() || chat.isLoading.value"
        class="send-btn"
      >
        <span v-if="!chat.isLoading.value">發送</span>
        <span v-else>等待中...</span>
      </button>
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
  if (chat.inputValue.value.trim()) {
    chat.sendMessage(chat.inputValue.value)
  }
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
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: slideIn 0.4s ease-out;
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
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.chat-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.clear-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 3px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  text-align: center;
}

.empty-state p {
  font-size: 1.125rem;
  margin: 0 0 0.5rem 0;
}

.empty-state small {
  color: #bbb;
}

.error-banner {
  padding: 0.75rem 1rem;
  background: #fee;
  border-left: 4px solid #f44;
  border-radius: 4px;
  color: #c33;
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
  background: #667eea;
  color: white;
}

.role-badge.assistant {
  background: #f0f0f0;
  color: #667eea;
}

.message p {
  margin: 0;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  line-height: 1.5;
  word-wrap: break-word;
}

.message.user p {
  background: #667eea;
  color: white;
  border-bottom-right-radius: 4px;
}

.message.assistant p {
  background: #f0f0f0;
  color: #333;
  border-bottom-left-radius: 4px;
}

.timestamp {
  font-size: 0.75rem;
  color: #999;
  padding: 0 0.5rem;
}

.loading-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 12px;
  color: #667eea;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #f0f0f0;
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
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.chat-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s ease;
}

.chat-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.chat-input:disabled {
  background: #f5f5f5;
  color: #999;
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
</style>

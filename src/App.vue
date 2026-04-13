<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import ChatWindow from './components/ChatWindow.vue'
import { ref, computed } from 'vue'
import { useAnimation } from './composables/useAnimation'

const number = ref(0)
const square = computed(() => number.value * number.value)
const showChat = ref(false)

// 動畫 composables
const shake = useAnimation(820)
const pulse = useAnimation(500)

function handleInputChange() {
  // 輸入數字時觸發 pulse 動畫
  pulse.trigger()
}

function calculateSquare() {
  // 計算時觸發 shake 動畫
  shake.trigger()
}

function toggleChat() {
  showChat.value = !showChat.value
}
</script>

<template>
  <div class="container">
    <HelloWorld /> 
    
    <div class="input-group">
      <input 
        type="number" 
        v-model="number" 
        placeholder="輸入一個數字"
        @input="handleInputChange"
        class="input-field"
      />
      <button @click="calculateSquare" :class="{ shake: shake.isAnimating.value }">
        計算平方
      </button>
    </div>
    
    <p :class="{ pulse: pulse.isAnimating.value }" class="result">
      數字的平方是: {{ square }}
    </p>

    <button @click="toggleChat" class="chat-toggle-btn">
      {{ showChat ? '❌ 關閉對話' : '💬 打開 AI 對話' }}
    </button>

    <transition name="slide-up">
      <ChatWindow v-if="showChat" />
    </transition>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.input-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.input-field {
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 2px solid #ccc;
  border-radius: 0.5rem;
  transition: border-color 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: #4CAF50;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

.result {
  font-size: 1.25rem;
  font-weight: bold;
  padding: 1rem;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 0.5rem;
}

.chat-toggle-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: center;
}

.chat-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.chat-toggle-btn:active {
  transform: translateY(0);
}

/* Shake 動畫 - 用於按鈕 */
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

/* Pulse 動畫 - 用於結果文字 */
.pulse {
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1);
    background-color: #f0f0f0;
  }
  50% { 
    transform: scale(1.05);
    background-color: #ffd700;
  }
}

/* 過渡動畫 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
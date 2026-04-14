<script setup lang="ts">
import ChatWindow from './components/ChatWindow.vue'

</script>

<template>
  <div class="container">
    <ChatWindow />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0;
  width: 100%;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3f 100%);
  /* border: 1px solid red; */
  width: 100%;
}
</style>
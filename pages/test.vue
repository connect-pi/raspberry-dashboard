<script setup lang="ts">
const { isConnected, stats, error } = useWebSocket()
</script>

<template>
  <div>
    <div v-if="isConnected" class="text-green-600">Connected to WebSocket</div>
    <div v-else class="text-red-600">Disconnected from WebSocket</div>

    <div v-if="error" class="text-red-600">
      {{ error }}
    </div>

    <div v-if="stats">
      <pre>{{ JSON.stringify(stats, null, 2) }}</pre>
    </div>
  </div>
</template>

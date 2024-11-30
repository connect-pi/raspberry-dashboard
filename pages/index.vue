<script setup lang="ts">
import type { Stats } from '~/types/common/Stats'

const stats = ref<Stats>()
let socket: WebSocket | null = null

// Format uptime
function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  return `${days}d ${hours}h ${minutes}m`
}

// Establish WebSocket connection
// function setupWebSocket() {
//   const host = window.location.hostname
//   const wsUrl = `ws://${host}:3001`

//   // WebSocket create
//   socket = new WebSocket(wsUrl)

//   socket.onmessage = (event) => {
//     const data = JSON.parse(event.data) as Stats
//     stats.value = data
//   }

//   socket.onerror = (error) => {
//     console.error('WebSocket Error:', error)
//   }

//   socket.onopen = () => {
//     console.log('WebSocket connection established')
//   }

//   socket.onclose = () => {
//     console.log('WebSocket connection closed')
//   }
// }

const loadData = async () => {
  return await useFetch('/api/stats')
    .then((res) => {
      stats.value = res.data.value!

      setTimeout(loadData, 500)
    })
    .catch((error) => {
      console.error('Error fetching stats:', error)
    })
}

await loadData()

// Lifecycle hooks with cleanup
// onMounted(() => {
//   setupWebSocket() // Start WebSocket connection
// })
</script>

<template>
  <UContainer class="py-8 chakra-petch-regular">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex gap-2 md:gap-3 items-center justify-center">
        <UIcon
          name="i-heroicons-signal"
          class="text-primary-500 text-[30px] block"
        />
        <div>
          <h1 class="md:text-3xl text-2xl font-nothing">Connect Pi</h1>
        </div>
      </div>
      <!-- Theme and Refresh Controls -->
      <div class="flex items-center space-x-2">
        <ClientOnly>
          <ColorModeButton />
        </ClientOnly>

        <a href="/">
          <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost">
            Refresh
          </UButton>
        </a>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <UCard class="u-cart">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon
              name="i-heroicons-cpu-chip"
              class="text-primary-500 text-xl"
            />
            <h3 class="text-base font-medium">CPU Load</h3>
          </div>
        </template>
        <p class="text-2xl font-semibold font-nothing">
          {{ stats?.system?.cpuUsage?.toFixed(2) || '0' }}%
        </p>
        <UProgress
          :value="stats?.system?.cpuUsage || 0"
          color="primary"
          class="mt-2"
        />
      </UCard>

      <UCard class="u-cart">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon
              name="i-heroicons-circle-stack"
              class="text-amber-500 text-xl"
            />
            <h3 class="text-base font-medium">Memory Usage</h3>
          </div>
        </template>
        <p class="text-2xl font-semibold font-nothing">
          {{ stats?.system?.memory?.usage || '0' }}%
        </p>
        <UProgress
          :value="parseFloat(String(stats?.system?.memory?.usage) || '0')"
          color="amber"
          class="mt-2"
        />
      </UCard>

      <UCard class="u-cart">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-signal" class="text-rose-500 text-xl" />
            <h3 class="text-base font-medium">Network</h3>
          </div>
        </template>
        <p class="text-2xl font-semibold font-nothing">
          {{ stats?.network?.connectedClients || 0 }}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Connected Clients
        </p>
      </UCard>

      <UCard class="u-cart">
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-clock" class="text-blue-500 text-xl" />
            <h3 class="text-base font-medium">Uptime</h3>
          </div>
        </template>
        <p class="text-2xl font-semibold font-nothing">
          {{ formatUptime(stats?.system?.uptime || 0) }}
        </p>
      </UCard>
    </div>

    <!-- Network Status -->
    <UCard class="u-cart">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">Network Status</h3>
          <UBadge
            :color="stats?.v2ray ? 'primary' : 'red'"
            variant="subtle"
            class="ml-2"
          >
            V2Ray {{ stats?.v2ray ? 'Active' : 'Inactive' }}
          </UBadge>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-gray-500 dark:text-gray-400">IP Address</span>
          <span class="font-nothing">
            {{ stats?.network?.ipAddress || 'N/A' }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-500 dark:text-gray-400">
            Network Interface
          </span>
          <span class="font-nothing">
            {{ stats?.network?.interface || 'N/A' }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-gray-500 dark:text-gray-400">
            Connected Clients
          </span>
          <span class="font-nothing">
            {{ stats?.network?.connectedClients || 0 }}
          </span>
        </div>
      </div>
    </UCard>
  </UContainer>
</template>

<style>
body {
  @apply dark:bg-[#0b101a] bg-[#f6f9fd];
}

.u-cart {
  @apply border-[1px] border-[#e9eff6] dark:border-[#ffffff05];
  box-shadow: none !important;
  border-radius: 20px;
}

.px-4.py-5.sm\:p-6 {
  @apply border-[#e9eff6] dark:border-[#ffffff0d];
}
</style>

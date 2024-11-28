<template>
   <UContainer class="py-8 chakra-petch-regular">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
         <div class="flex gap-2 md:gap-3 items-center justify-center">
            <UIcon name="i-heroicons-signal" class="text-primary-500 text-[30px] block" />
            <div>
               <h1 class="md:text-3xl text-2xl font-nothing">Connect Pi</h1>
               <!-- <p class="text-gray-500 dark:text-gray-400 md:block hidden">
                  Raspberry Pi Dashboard
               </p> -->
            </div>
         </div>
         <!-- Theme and Refresh Controls -->
         <div class="flex items-center space-x-2">
            <ColorModeButton />
            <UButton
               icon="i-heroicons-arrow-path"
               color="gray"
               variant="ghost"
               :loading="loading"
               @click="refreshData">
               Refresh
            </UButton>
         </div>
      </div>

      <!-- Stats Overview -->
      <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <UCard class="u-cart">
            <template #header>
               <div class="flex items-center space-x-2">
                  <UIcon
                     name="i-heroicons-cpu-chip"
                     class="text-primary-500 text-xl" />
                  <h3 class="text-base font-medium">CPU Load</h3>
               </div>
            </template>
            <p class="text-2xl font-semibold font-nothing">
               {{ systemStats?.cpuUsage?.toFixed(2) || "0" }}%
            </p>
            <UProgress
               :value="systemStats?.cpuUsage || 0"
               color="primary"
               class="mt-2" />
         </UCard>

         <UCard class="u-cart">
            <template #header>
               <div class="flex items-center space-x-2">
                  <UIcon
                     name="i-heroicons-circle-stack"
                     class="text-amber-500 text-xl" />
                  <h3 class="text-base font-medium">Memory Usage</h3>
               </div>
            </template>
            <p class="text-2xl font-semibold font-nothing">
               {{ systemStats?.memory?.usage || "0" }}%
            </p>
            <UProgress
               :value="parseFloat(systemStats?.memory?.usage || '0')"
               color="amber"
               class="mt-2" />
         </UCard>

         <UCard class="u-cart">
            <template #header>
               <div class="flex items-center space-x-2">
                  <UIcon name="i-heroicons-signal" class="text-rose-500 text-xl" />
                  <h3 class="text-base font-medium">Network</h3>
               </div>
            </template>
            <p class="text-2xl font-semibold font-nothing">
               {{ systemStats?.network?.connectedClients || 0 }}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Connected Clients</p>
         </UCard>

         <UCard class="u-cart">
            <template #header>
               <div class="flex items-center space-x-2">
                  <UIcon name="i-heroicons-clock" class="text-blue-500 text-xl" />
                  <h3 class="text-base font-medium">Uptime</h3>
               </div>
            </template>
            <p class="text-2xl font-semibold font-nothing">
               {{ formatUptime(systemStats?.uptime || 0) }}
            </p>
         </UCard>
      </div>

      <!-- Network Status -->
      <UCard class="u-cart">
         <template #header>
            <div class="flex items-center justify-between">
               <h3 class="text-lg font-medium">Network Status</h3>
               <UBadge
                  :color="systemStats?.v2rayStatus ? 'primary' : 'red'"
                  variant="subtle"
                  class="ml-2">
                  V2Ray {{ systemStats?.v2rayStatus ? "Active" : "Inactive" }}
               </UBadge>
            </div>
         </template>

         <div class="space-y-4">
            <div class="flex items-center justify-between">
               <span class="text-gray-500 dark:text-gray-400">IP Address</span>
               <span class="font-nothing">
                  {{ systemStats?.network?.ipAddress || "N/A" }}
               </span>
            </div>
            <div class="flex items-center justify-between">
               <span class="text-gray-500 dark:text-gray-400">
                  Network Interface
               </span>
               <span class="font-nothing">
                  {{ systemStats?.network?.interface || "N/A" }}
               </span>
            </div>
            <div class="flex items-center justify-between">
               <span class="text-gray-500 dark:text-gray-400">
                  Connected Clients
               </span>
               <span class="font-nothing">
                  {{ systemStats?.network?.connectedClients || 0 }}
               </span>
            </div>
         </div>
      </UCard>
   </UContainer>
</template>

<script setup lang="ts">
   const systemStats = ref(null);
   const loading = ref(false);
   let refreshInterval: NodeJS.Timer | null = null;

   // Format uptime
   function formatUptime(seconds: number): string {
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);

      return `${days}d ${hours}h ${minutes}m`;
   }

   // Update system stats with error handling
   async function refreshData() {
      if (loading.value) return;

      loading.value = true;
      try {
         const response = await fetch("/api/stats");
         if (!response.ok) throw new Error("Failed to fetch stats");

         const data = await response.json();
         systemStats.value = data;
      } catch (error) {
         console.error("Error fetching stats:", error);
      } finally {
         loading.value = false;
      }
   }

   // Lifecycle hooks with cleanup
   onMounted(() => {
      refreshData();
      refreshInterval = setInterval(refreshData, 2000);
   });

   onBeforeUnmount(() => {
      if (refreshInterval) {
         clearInterval(refreshInterval);
      }
   });
</script>

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

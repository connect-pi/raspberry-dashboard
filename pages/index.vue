<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold mb-8">Raspberry Pi Dashboard</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- System Status Card -->
        <DashboardCard title="System Status">
          <template v-if="systemStats">
            <div class="space-y-4">
              <StatusItem
                label="CPU Load"
                :value="`${systemStats.cpuUsage.toFixed(2)}%`"
              />
              <StatusItem
                label="Memory Usage"
                :value="`${systemStats.memory.usage}%`"
              />
              <StatusItem
                label="Uptime"
                :value="formatUptime(systemStats.uptime)"
              />
            </div>
          </template>
          <template v-else>
            <div class="text-gray-500">Loading system information...</div>
          </template>
        </DashboardCard>

        <!-- Network Status Card -->
        <DashboardCard title="Network Status">
          <template v-if="systemStats?.network">
            <div class="space-y-4">
              <StatusItem
                label="IP Address"
                :value="systemStats.network.ipAddress"
              />
              <StatusItem
                label="Connected Clients"
                :value="systemStats.network.connectedClients"
              />
              <StatusItem
                label="V2Ray Status"
                :value="systemStats.v2rayStatus ? 'Active' : 'Inactive'"
                :status="systemStats.v2rayStatus ? 'success' : 'error'"
              />
            </div>
          </template>
          <template v-else>
            <div class="text-gray-500">Loading network information...</div>
          </template>
        </DashboardCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { systemStats } = useSystemStats()

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  return `${days}d ${hours}h ${minutes}m`
}
</script>
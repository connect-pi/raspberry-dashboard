<template>
    <DashboardCard title="Connected Devices">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostname</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signal</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connected</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traffic (TX/RX)</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="device in devices" :key="device.macAddress">
              <td class="px-6 py-4 whitespace-nowrap">{{ device.hostname }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ device.ipAddress }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ device.signalStrength }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ device.connectedTime }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ device.txBytes }} / {{ device.rxBytes }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </DashboardCard>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    devices: {
      macAddress: string
      ipAddress: string
      hostname: string
      signalStrength: string
      connectedTime: string
      txBytes: string
      rxBytes: string
    }[]
  }>()
  </script>
<template>
    <div class="flex justify-between items-center">
      <span class="text-gray-600">{{ label }}</span>
      <span
        class="font-medium"
        :class="{
          'text-green-600': status === 'success',
          'text-red-600': status === 'error',
          'text-gray-900': !status
        }"
      >
        {{ value }}
      </span>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    label: string
    value: string | number
    status?: 'success' | 'error'
  }>()
  </script>
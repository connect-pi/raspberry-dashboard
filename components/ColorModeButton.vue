<template>
  <UButton
    color="gray"
    variant="ghost"
    :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'"
    @click="toggleColorMode"
  />
</template>

<script setup>
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

export function useSystemStats() {
    const systemStats = ref(null)
    const error = ref(null)
    let timer: NodeJS.Timer | null = null
  
    async function fetchStats() {
      try {
        const { data, error: fetchError } = await useFetch('/api/stats')
        if (fetchError.value) throw fetchError.value
        systemStats.value = data.value
      } catch (err) {
        error.value = err
        console.error('Error fetching stats:', err)
      }
    }
  
    onMounted(() => {
      fetchStats()
      timer = setInterval(fetchStats, 2000)
    })
  
    onBeforeUnmount(() => {
      if (timer) clearInterval(timer)
    })
  
    return {
      systemStats,
      error
    }
  }
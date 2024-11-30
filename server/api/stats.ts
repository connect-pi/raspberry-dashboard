import { useStats } from '~/composables/useStats'
import type { Stats } from '~/types/common/Stats'

export default defineEventHandler(async (): Promise<Stats> => {
  // Get Data
  return await useStats()
    .then((data) => data)
    .catch((error) => {
      console.error('Error fetching stats:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch system stats'
      })
    })
})

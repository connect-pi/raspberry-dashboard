import { getSystemStats } from '../utils/system'
import { getNetworkInfo } from '../utils/network'
import { getV2rayStatus } from '../utils/v2ray'
import type { Stats } from '~/types/common/Stats'

export default defineEventHandler(async (): Promise<Stats> => {
  try {
    const [systemStats, networkInfo, v2rayStatus] = await Promise.all([
      getSystemStats(),
      getNetworkInfo(),
      getV2rayStatus()
    ])

    return {
      system: systemStats,
      network: networkInfo,
      v2ray: v2rayStatus
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch system stats'
    })
  }
})

import { getNetworkInfo } from '~/server/utils/network'
import { getV2rayStatus } from '~/server/utils/v2ray'
import { getSystemStats } from '~/server/utils/system'
import type { Stats } from '~/types/common/Stats'

export const useStats = async (): Promise<Stats> => {
  // Get Data
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
}

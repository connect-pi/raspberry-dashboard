import os from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export default defineEventHandler(async () => {
  try {
    const systemStats = {
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        usage: ((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)
      },
      cpuUsage: os.loadavg()[0],
      uptime: os.uptime(),
      network: await getNetworkInfo(),
      v2rayStatus: await getV2rayStatus()
    }
    
    return systemStats
  } catch (error) {
    console.error('Error fetching system stats:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch system stats'
    })
  }
})

async function getNetworkInfo() {
  try {
    // Get IP address
    const { stdout: ipInfo } = await execAsync('hostname -I')
    const ipAddress = ipInfo.trim().split(' ')[0]

    // Get connected clients using iw
    let connectedClients = 0
    try {
      // First try with nl80211 interface
      const { stdout: stationDump } = await execAsync('iw dev wlan0 station dump')
      connectedClients = (stationDump.match(/Station/g) || []).length
    } catch {
      try {
        // If iw fails, try with hostapd_cli
        const { stdout: clientList } = await execAsync('hostapd_cli list_sta')
        connectedClients = clientList.trim().split('\n').filter(line => line.length > 0).length
      } catch (e) {
        console.error('Failed to get client count:', e)
        connectedClients = 0
      }
    }
    
    return {
      ipAddress,
      connectedClients,
      interface: 'wlan0'
    }
  } catch (error) {
    console.error('Error getting network info:', error)
    return {
      ipAddress: 'N/A',
      connectedClients: 0,
      interface: 'Error'
    }
  }
}

async function getV2rayStatus() {
  try {
    const { stdout } = await execAsync('systemctl is-active v2ray')
    return stdout.trim() === 'active'
  } catch {
    return false
  }
}
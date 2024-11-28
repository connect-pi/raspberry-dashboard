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
    // Get all network interfaces
    const networkInterfaces = os.networkInterfaces()
    
    // Find WiFi interface (usually en0 on Mac)
    const wifiInterface = Object.entries(networkInterfaces).find(([name]) => 
      name.startsWith('en0') || name.startsWith('wlan')
    )

    if (wifiInterface) {
      const ipv4Address = wifiInterface[1]?.find(addr => addr.family === 'IPv4')
      return {
        ipAddress: ipv4Address?.address || 'N/A',
        interface: wifiInterface[0],
        connectedClients: 'N/A' // This info isn't easily available on Mac
      }
    }

    return {
      ipAddress: 'N/A',
      interface: 'Not found',
      connectedClients: 'N/A'
    }
  } catch (error) {
    console.error('Error getting network info:', error)
    return {
      ipAddress: 'N/A',
      interface: 'Error',
      connectedClients: 'N/A'
    }
  }
}

async function getV2rayStatus() {
  try {
    // Check if running on Mac
    const { stdout: platformCheck } = await execAsync('uname')
    if (platformCheck.trim() === 'Darwin') {
      // Mac-specific V2Ray check (if you have V2Ray installed via brew)
      const { stdout } = await execAsync('brew services list | grep v2ray')
      return stdout.includes('started')
    } else {
      // Linux check
      const { stdout } = await execAsync('systemctl is-active v2ray')
      return stdout.trim() === 'active'
    }
  } catch {
    return false
  }
}
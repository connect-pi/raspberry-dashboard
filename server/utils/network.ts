import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface NetworkInfo {
  ipAddress: string
  interface: string
  connectedClients: number
}

export async function getNetworkInfo(): Promise<NetworkInfo> {
  try {
    // Get IP address
    const { stdout: ipInfo } = await execAsync('hostname -I')
    const ipAddress = ipInfo.trim().split(' ')[0]

    // Try different methods to get connected clients count
    let connectedClients = 0
    try {
      // First try with iw
      const { stdout } = await execAsync('iw dev wlan0 station dump | grep Station | wc -l')
      connectedClients = parseInt(stdout.trim()) || 0
    } catch {
      try {
        // If iw fails, try hostapd_cli
        const { stdout } = await execAsync('hostapd_cli list_sta | wc -l')
        connectedClients = parseInt(stdout.trim()) || 0
      } catch (e) {
        console.error('Failed to get client count:', e)
      }
    }
    
    return {
      ipAddress,
      interface: 'wlan0',
      connectedClients
    }
  } catch (error) {
    console.error('Error getting network info:', error)
    return {
      ipAddress: 'N/A',
      interface: 'Error',
      connectedClients: 0
    }
  }
}
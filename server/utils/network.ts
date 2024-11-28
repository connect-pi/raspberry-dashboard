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

    // Get number of connected clients
    const { stdout: stationDump } = await execAsync('sudo iw dev wlan0 station dump | grep Station | wc -l')
    const connectedClients = parseInt(stationDump.trim()) || 0
    
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
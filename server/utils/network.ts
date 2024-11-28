import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export interface ConnectedDevice {
  macAddress: string
  ipAddress: string
  hostname: string
  signalStrength: string
  connectedTime: string
  txBytes: string
  rxBytes: string
  rxBitrate: string
  txBitrate: string
}

export interface NetworkInfo {
  ipAddress: string
  interface: string
  connectedClients: number
  connectedDevices: ConnectedDevice[]
}

export async function getNetworkInfo(): Promise<NetworkInfo> {
  try {
    // Get IP address
    const { stdout: ipInfo } = await execAsync('hostname -I')
    const ipAddress = ipInfo.trim().split(' ')[0]

    // Get connected devices information
    const connectedDevices = await getConnectedDevices()
    
    return {
      ipAddress,
      interface: 'wlan0',
      connectedClients: connectedDevices.length,
      connectedDevices
    }
  } catch (error) {
    console.error('Error getting network info:', error)
    return {
      ipAddress: 'N/A',
      interface: 'Error',
      connectedClients: 0,
      connectedDevices: []
    }
  }
}

async function getConnectedDevices(): Promise<ConnectedDevice[]> {
  try {
    // Get station dump information
    const { stdout: stationDump } = await execAsync('sudo iw dev wlan0 station dump')
    
    // Parse station dump
    return stationDump
      .split('Station')
      .filter(station => station.trim())
      .map(station => {
        const lines = station.split('\n')
        const macAddress = lines[0].trim().split(' ')[0]
        
        // Helper function to get value from lines
        const getValue = (key: string): string => {
          const line = lines.find(l => l.includes(key))
          return line ? line.split(':')[1].trim() : 'N/A'
        }

        const rxBytes = parseInt(getValue('rx bytes'))
        const txBytes = parseInt(getValue('tx bytes'))
        const connectedTime = parseInt(getValue('connected time'))
        const txBitrate = getValue('tx bitrate')
        const rxBitrate = getValue('rx bitrate')

        return {
          macAddress,
          ipAddress: 'N/A', // We can implement DHCP lease lookup later if needed
          hostname: macAddress.replace(/:/g, '-'), // Using MAC as hostname for now
          signalStrength: 'N/A', // Signal strength not shown in output
          connectedTime: formatConnectedTime(connectedTime),
          txBytes: formatBytes(txBytes),
          rxBytes: formatBytes(rxBytes),
          txBitrate,
          rxBitrate
        }
      })
  } catch (error) {
    console.error('Error getting connected devices:', error)
    return []
  }
}

function formatBytes(bytes: number): string {
  if (isNaN(bytes)) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

function formatConnectedTime(seconds: number): string {
  if (isNaN(seconds)) return 'N/A'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}
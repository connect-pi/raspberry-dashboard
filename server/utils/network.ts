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
    // Get station dump information using sudo
    const { stdout: stationDump } = await execAsync('sudo iw dev wlan0 station dump')
    
    // Parse station dump
    const stations = stationDump.split('Station')
      .filter(station => station.trim())
      .map(station => {
        const macAddress = station.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/)?.[0] || ''
        const signalStrength = station.match(/signal:\s+([-\d]+)\s+dBm/)?.[1] || 'N/A'
        const connectedTime = station.match(/connected time:\s+(\d+)\s+seconds/)?.[1] || 'N/A'
        const txBytes = station.match(/tx bytes:\s+(\d+)/)?.[1] || '0'
        const rxBytes = station.match(/rx bytes:\s+(\d+)/)?.[1] || '0'

        // Try to get IP from dhcp leases
        let ipAddress = 'N/A'
        try {
          const { stdout: leases } = execAsync('cat /var/lib/misc/dnsmasq.leases')
          const lease = leases.split('\n').find(line => line.includes(macAddress))
          if (lease) {
            ipAddress = lease.split(' ')[2]
          }
        } catch {
          // Ignore errors
        }

        return {
          macAddress,
          ipAddress,
          hostname: 'Unknown', // We'll implement this later if needed
          signalStrength: `${signalStrength} dBm`,
          connectedTime: formatConnectedTime(parseInt(connectedTime)),
          txBytes: formatBytes(parseInt(txBytes)),
          rxBytes: formatBytes(parseInt(rxBytes))
        }
      })

    return stations
  } catch (error) {
    console.error('Error getting connected devices:', error)
    return []
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
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
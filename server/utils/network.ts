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
    // Get station dump information
    const { stdout: stationDump } = await execAsync('iw dev wlan0 station dump')
    
    // Get ARP table for IP and hostname mapping
    const { stdout: arpTable } = await execAsync('arp -a')
    
    // Create function to get hostname
    async function getHostname(ip: string): Promise<string> {
      try {
        const { stdout: hostnameResult } = await execAsync(`host ${ip}`)
        return hostnameResult.split(' ').pop()?.trim() || 'Unknown'
      } catch {
        return 'Unknown'
      }
    }

    // Parse station dump
    const stationPromises = stationDump.split('Station')
      .filter(station => station.trim())
      .map(async station => {
        const macAddress = station.match(/([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})/)?.[0] || ''
        const signalStrength = station.match(/signal:\s+([-\d]+)\s+dBm/)?.[1] || 'N/A'
        const connectedTime = station.match(/connected time:\s+(\d+)\s+seconds/)?.[1] || 'N/A'
        const txBytes = station.match(/tx bytes:\s+(\d+)/)?.[1] || '0'
        const rxBytes = station.match(/rx bytes:\s+(\d+)/)?.[1] || '0'

        // Find IP from ARP table
        const arpEntry = arpTable.match(new RegExp(`\\((.+)\\) at ${macAddress}`))
        const ipAddress = arpEntry?.[1] || 'N/A'
        
        // Get hostname
        const hostname = await getHostname(ipAddress)

        return {
          macAddress,
          ipAddress,
          hostname,
          signalStrength: `${signalStrength} dBm`,
          connectedTime: formatConnectedTime(parseInt(connectedTime)),
          txBytes: formatBytes(parseInt(txBytes)),
          rxBytes: formatBytes(parseInt(rxBytes))
        }
      })

    return await Promise.all(stationPromises)
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
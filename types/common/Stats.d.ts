export interface Stats {
  system: SystemStats
  network: NetworkInfo
  v2ray: V2rayStatus
}

export interface SystemStats {
  memory: {
    total: number
    free: number
    usage: number
  }
  cpuUsage: number
  uptime: number
}

export type V2rayStatus = boolean

export interface NetworkInfo {
  ipAddress: string
  interface: string
  connectedClients: number
}

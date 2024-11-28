import os from 'os'

export interface SystemStats {
  memory: {
    total: number
    free: number
    usage: string
  }
  cpuUsage: number
  uptime: number
}

export function getSystemStats(): SystemStats {
  return {
    memory: {
      total: os.totalmem(),
      free: os.freemem(),
      usage: ((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)
    },
    cpuUsage: os.loadavg()[0],
    uptime: os.uptime()
  }
}
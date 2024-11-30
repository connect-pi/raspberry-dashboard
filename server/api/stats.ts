import { WebSocketServer } from 'ws'
import { getSystemStats } from '../utils/system'
import { getNetworkInfo } from '../utils/network'
import { getV2rayStatus } from '../utils/v2ray'

const wss = new WebSocketServer({ port: 3001 }) // WebSocket server
wss.on('connection', (ws) => {
  console.log('Client connected')

  const sendStats = () => {
    // Get Data
    Promise.all([getSystemStats(), getNetworkInfo(), getV2rayStatus()])
      .then(([systemStats, networkInfo, v2rayStatus]) => {
        const data = {
          ...systemStats,
          network: networkInfo,
          v2rayStatus
        }
        // Send data to client
        ws.send(JSON.stringify(data))
      })
      .catch((error) => {
        console.error('Error fetching stats:', error)
      })
  }

  const interval = setInterval(sendStats, 2000)

  ws.on('close', () => {
    clearInterval(interval)
  })
})

console.log('WebSocket server is running on ws://localhost:3001')
import { WebSocketServer } from 'ws'
import { useStats } from '~/composables/useStats'

const wss = new WebSocketServer({ port: 3001 }) // WebSocket server
wss.on('connection', (ws) => {
  console.log('Client connected')

  const sendStats = () => {
    // Get Data
    useStats()
      .then((data) => {
        // Send data to client
        ws.send(JSON.stringify(data))
      })
      .catch((error) => {
        console.error('Error fetching stats:', error)
      })
  }

  const interval = setInterval(sendStats, 500)

  ws.on('close', () => {
    clearInterval(interval)
  })
})

console.log('WebSocket server is running on ws://localhost:3001')

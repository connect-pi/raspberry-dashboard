import { writeFile } from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export default defineEventHandler(async (event) => {
  try {
    const config = await readBody(event)
    
    // Save configuration to correct path
    await writeFile('/usr/local/etc/v2ray/config.json', JSON.stringify(config, null, 2))
    
    // Restart V2Ray service
    await execAsync('sudo systemctl restart v2ray')
    
    return { 
      success: true,
      message: 'Configuration updated successfully'
    }
  } catch (error) {
    console.error('Error updating V2Ray config:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update V2Ray configuration'
    })
  }
})
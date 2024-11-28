import { writeFile } from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export default defineEventHandler(async (event) => {
  try {
    const config = await readBody(event)
    
    console.log('Attempting to write config to:', '/usr/local/etc/v2ray/config.json')
    
    try {
      // Save configuration to correct path
      await writeFile('/usr/local/etc/v2ray/config.json', JSON.stringify(config, null, 2))
      console.log('Config file written successfully')
    } catch (writeError) {
      console.error('Error writing config file:', writeError)
      throw writeError
    }
    
    try {
      // Restart V2Ray service
      const { stdout, stderr } = await execAsync('sudo systemctl restart v2ray')
      console.log('V2Ray restart output:', stdout)
      if (stderr) console.error('V2Ray restart stderr:', stderr)
    } catch (restartError) {
      console.error('Error restarting V2Ray:', restartError)
      throw restartError
    }
    
    return { 
      success: true,
      message: 'Configuration updated successfully'
    }
  } catch (error) {
    console.error('Detailed error:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update V2Ray configuration'
    })
  }
})
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function getV2rayStatus(): Promise<boolean> {
  try {
    const { stdout } = await execAsync('systemctl is-active v2ray')
    return stdout.trim() === 'active'
  } catch {
    return false
  }
}

import { exec } from 'child_process'
import { promisify } from 'util'
import { V2rayStatus } from '~/types/common/Stats'

const execAsync = promisify(exec)

export async function getV2rayStatus(): Promise<V2rayStatus> {
  try {
    const { stdout } = await execAsync('systemctl is-active v2ray')
    return stdout.trim() === 'active'
  } catch {
    return false
  }
}

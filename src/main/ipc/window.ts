import { ipcMain } from 'electron'
import { ipc } from '@shared/vars'
import { WindowService } from '@main/services/windowService'

export function registerWindowIpc(window: WindowService) {
  ipcMain.handle(ipc.windowSelectDir, async () => {
    return await window.selectDirectory()
  })
}

import { ipcMain } from 'electron'
import { StorageService } from '@main/services/storageService'
import { Settings } from '@shared/types'
import { ipc } from '@shared/vars'

export function registerStorageIpc(storage: StorageService) {
  ipcMain.on(ipc.storageOpenDir, (_, infoHash: string) => {
    storage.openDir(infoHash)
  })

  ipcMain.on(ipc.storageOpenDownloadsDir, () => {
    storage.openDownloadsDir()
  })

  ipcMain.handle(ipc.storageGetSettings, () => {
    return storage.getSettings()
  })

  ipcMain.on(ipc.storageSetSettings, async (_, settings: Settings) => {
    storage.setSettings(settings)
  })
}

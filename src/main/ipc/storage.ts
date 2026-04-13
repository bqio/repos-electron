import { ipcMain } from 'electron'
import { StorageService } from '@main/services/storageService'
import { Repository, Settings } from '@shared/types'
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

  ipcMain.on(ipc.storagePushRepo, async (_, repo: Repository) => {
    await storage.pushRepo(repo)
  })

  ipcMain.on(ipc.storageDropRepo, async (_, name: string, version: string) => {
    await storage.dropRepo(name, version)
  })

  ipcMain.on(ipc.storageSetRepo, async (_, id: string) => {
    storage.setRepo(id)
  })

  ipcMain.handle(ipc.storageGetRepos, () => {
    return storage.getRepos()
  })

  ipcMain.handle(ipc.storageGetRepo, () => {
    return storage.getRepo()
  })
}

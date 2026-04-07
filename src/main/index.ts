import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createAppContext } from '@main/contexts/createAppContext'
import { bootstrapApp } from '@main/bootstrap'
import { registerTorrentIpc } from '@main/ipc/torrent'
import { registerStorageIpc } from '@main/ipc/storage'
import { registerWindowIpc } from '@main/ipc/window'

const APP_USER_MODEL_ID = 'ru.repos.app'

app
  .whenReady()
  .then(() => Promise.all([import('webtorrent')]))
  .then(async ([WebTorrentModule]) => {
    electronApp.setAppUserModelId(APP_USER_MODEL_ID)

    // Core boostrap
    const WebTorrentClass = WebTorrentModule.default
    const ctx = await createAppContext(WebTorrentClass)
    const services = await bootstrapApp(ctx)

    // IPC register
    registerTorrentIpc(services.torrentService)
    registerStorageIpc(services.storageService)
    registerWindowIpc(services.windowService)

    // App events
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    app.on('window-all-closed', () => {
      services.updateService.stop()

      if (ctx.client) {
        ctx.client.destroy()
      }

      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('before-quit', () => {
      services.updateService.stop()
    })

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) {
        // createWindow()
      }
    })
  })
  .catch((error) => {
    console.error('Failed to initialize app:', error)
  })

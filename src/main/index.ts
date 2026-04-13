import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createAppContext } from '@main/contexts/createAppContext'
import { bootstrapApp } from '@main/bootstrap'
import { registerTorrentIpc } from '@main/ipc/torrent'
import { registerStorageIpc } from '@main/ipc/storage'
import { registerWindowIpc } from '@main/ipc/window'
import log from 'electron-log'

const APP_USER_MODEL_ID = 'fun.repos.app'

log.transports.file.level = 'info'
log.transports.console.level = 'debug'

console.log = (...args: any) => log.info(...args)
console.info = (...args: any) => log.info(...args)
console.warn = (...args: any) => log.warn(...args)
console.error = (...args: any) => log.error(...args)
console.debug = (...args: any) => log.debug(...args)

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

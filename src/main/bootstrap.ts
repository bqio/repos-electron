import { is } from '@electron-toolkit/utils'
import { StorageService } from '@main/services/storageService'
import { TorrentService } from '@main/services/torrentService'
import { UpdateService } from '@main/services/updateService'
import { WindowService } from '@main/services/windowService'
import { AppContext } from '@shared/types'
import { shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import { join } from 'node:path'
import log from 'electron-log'

autoUpdater.logger = log

export async function bootstrapApp(ctx: AppContext) {
  const storageService = await StorageService.create()
  const torrentService = new TorrentService(ctx, storageService)
  const windowService = new WindowService(ctx)
  const updateService = new UpdateService(torrentService, windowService)

  // auto updates
  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('checking-for-update', () => {
    console.log('Проверка обновлений...')
    windowService.window.webContents.send('update-status', 'Проверка обновлений...')
  })

  autoUpdater.on('update-available', (info) => {
    console.log('Доступно обновление:', info.version)
    windowService.window.webContents.send('update-available', info)
  })

  autoUpdater.on('update-not-available', () => {
    console.log('У вас последняя версия')
    windowService.window.webContents.send('update-status', 'У вас последняя версия')
  })

  autoUpdater.on('error', (err) => {
    console.error('Ошибка обновления:', err)
    windowService.window.webContents.send('update-error', err.message)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    let percent = progressObj.percent.toFixed(2)
    console.log(`Скачивание: ${percent}%`)
    windowService.window.webContents.send('download-progress', progressObj)
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Обновление скачано, будет установлено при перезапуске')
    windowService.window.webContents.send('update-downloaded', info)

    // Автоматическая установка через 5 секунд
    setTimeout(() => {
      autoUpdater.quitAndInstall()
    }, 5000)
  })

  // Window events
  windowService.window.on('ready-to-show', () => windowService.window.show())

  windowService.window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    windowService.window.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    windowService.window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  windowService.window.webContents.on('did-finish-load', () => {
    console.log('[BOOTSTRAP]', 'Page successfuly loaded')
    updateService.start()
  })

  windowService.window.webContents.on('did-fail-load', () => {
    console.log('Page failed to load')
  })

  // Init logic
  await storageService.createDownloadsDirectory()
  torrentService.checkActiveTorrents()

  return {
    torrentService,
    windowService,
    updateService,
    storageService
  }
}

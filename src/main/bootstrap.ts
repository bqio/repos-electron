import { is } from '@electron-toolkit/utils'
import { StorageService } from '@main/services/storageService'
import { TorrentService } from '@main/services/torrentService'
import { UpdateService } from '@main/services/updateService'
import { WindowService } from '@main/services/windowService'
import { AppContext } from '@shared/types'
import { shell } from 'electron'
import { join } from 'node:path'

export async function bootstrapApp(ctx: AppContext) {
  const storageService = await StorageService.create()
  const torrentService = new TorrentService(ctx, storageService)
  const windowService = new WindowService(ctx)
  const updateService = new UpdateService(torrentService, windowService)

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

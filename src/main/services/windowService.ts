import { AppContext } from '@shared/types'
import { dialog } from 'electron'

export class WindowService {
  constructor(private ctx: AppContext) {}

  send(channel: string, payload: any) {
    if (this.ctx.mainWindow && !this.ctx.mainWindow.isDestroyed()) {
      this.ctx.mainWindow.webContents.send(channel, payload)
    }
  }

  get window() {
    return this.ctx.mainWindow
  }

  async selectDirectory(): Promise<string | null> {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (!result.canceled && result.filePaths.length > 0) {
      return result.filePaths[0]
    }
    return null
  }
}

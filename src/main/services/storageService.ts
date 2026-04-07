import { DownloadingItem, Settings, Storage } from '@shared/types'
import { getInfoHashFromMagnet } from '@shared/utils'
import { app, shell } from 'electron'
import { Low } from 'lowdb'
import { JSONFilePreset } from 'lowdb/node'
import { join } from 'node:path'
import fs from 'node:fs/promises'

const STORAGE_PATH = join(app.getPath('userData'), 'storage.json')
const DOWNLOADS_PATH = join(app.getPath('userData'), 'Downloads')

export class StorageService {
  constructor(private storage: Low<Storage>) {}

  static async create(): Promise<StorageService> {
    const defaultData: Storage = {
      downloading: [],
      repositories: [],
      favorites: [],
      settings: {
        downloadPath: DOWNLOADS_PATH,
        language: 'en',
        theme: 'system'
      }
    }

    const storage = await JSONFilePreset<Storage>(STORAGE_PATH, defaultData)

    return new StorageService(storage)
  }

  async createDownloadsDirectory(): Promise<void> {
    try {
      console.log('[STORAGE_SERVICE]', 'Creating downloads directory if not exists')
      await fs.mkdir(this.storage.data.settings.downloadPath, { recursive: true })
    } catch (err) {
      console.error(err)
    }
  }

  getDownloadingItems(): DownloadingItem[] {
    return this.storage.data.downloading
  }

  getSettings(): Settings {
    return this.storage.data.settings
  }

  async setSettings(settings: Settings) {
    await this.storage.update((data) => {
      data.settings = settings
    })
  }

  async addTorrent(magnetURI: string): Promise<void> {
    const infoHash = getInfoHashFromMagnet(magnetURI)
    await this.storage.update((data) => {
      const exists = data.downloading.some((t) => t.infoHash === infoHash)
      if (!exists) {
        data.downloading.push({ magnetURI, infoHash })
      } else {
        console.error('[STORAGE_SERVICE]', 'Torrent already exists in DB')
      }
    })
  }

  async removeTorrent(infoHash: string): Promise<void> {
    await this.storage.update((data) => {
      data.downloading = data.downloading.filter((t) => t.infoHash !== infoHash.toUpperCase())
    })
  }

  openDir(infoHash: string) {
    const downloadPath = join(this.storage.data.settings.downloadPath, infoHash)
    shell.openPath(downloadPath)
  }

  openDownloadsDir() {
    shell.openPath(this.storage.data.settings.downloadPath)
  }
}

import { StorageService } from '@main/services/storageService'
import { AppContext, DownloadingItem, WebClientTorrent } from '@shared/types'
import { getInfoHashFromMagnet } from '@shared/utils'
import { Wire } from 'bittorrent-protocol'
import { join } from 'node:path'

export class TorrentService {
  constructor(
    private ctx: AppContext,
    private storage: StorageService
  ) {
    this.ctx.client.on('error', (err) => {
      console.error('[TORRENT_SERVICE]', 'WebTorrent error:', err)
    })

    this.ctx.client.on('torrent', (torrent) => {
      console.log('[TORRENT_SERVICE]', 'New torrent added:', torrent.name)
    })
  }

  getTorrents(): WebClientTorrent[] {
    return this.ctx.client.torrents.map((torrent) => ({
      name: torrent.name,
      infoHash: torrent.infoHash,
      magnetURI: torrent.magnetURI,
      timeRemaining: torrent.timeRemaining,
      received: torrent.received,
      downloaded: torrent.downloaded,
      uploaded: torrent.uploaded,
      downloadSpeed: torrent.downloadSpeed,
      uploadSpeed: torrent.uploadSpeed,
      progress: torrent.progress,
      path: torrent.path,
      ready: torrent.ready,
      paused: torrent.paused,
      done: torrent.done,
      length: torrent.length,
      numPeers: torrent.numPeers
    }))
  }

  getTorrentsActive(): WebClientTorrent[] {
    const torrents = this.getTorrents()
    return torrents.filter((torrent) => !torrent.done)
  }

  async add(magnetURI: string): Promise<void> {
    await this.storage.addTorrent(magnetURI)
    this.addExists(magnetURI)
  }

  addExists(magnetURI: string): void {
    const infoHash = getInfoHashFromMagnet(magnetURI)

    if (infoHash) {
      const settings = this.storage.getSettings()
      const downloadPath = join(settings.downloadPath, infoHash.toLowerCase())

      console.log('[TORRENT_SERVICE]', 'Add torrent:', infoHash.toLowerCase())
      console.log('[TORRENT_SERVICE]', 'Download to:', downloadPath)

      const torrent = this.ctx.client.add(magnetURI, {
        path: downloadPath
      })

      torrent.on('infoHash', () => {
        console.log('[TORRENT_SERVICE]', `[${torrent.infoHash}]`, `Init`)
      })

      torrent.on('metadata', () => {
        console.log('[TORRENT_SERVICE]', `[${torrent.infoHash}]`, 'Got metadata!')
        console.log(
          '[TORRENT_SERVICE]',
          `[${torrent.infoHash}]`,
          'Files:',
          torrent.files.map((f) => f.name)
        )
        console.log('[TORRENT_SERVICE]', `[${torrent.infoHash}]`, 'Total size:', torrent.length)
      })

      torrent.on('ready', () => {
        console.log('[TORRENT_SERVICE]', `[${torrent.infoHash}]`, 'ready:', torrent.infoHash)
      })

      torrent.on('done', () => {
        console.log('[TORRENT_SERVICE]', `[${torrent.infoHash}]`, 'Download complete!')
      })

      torrent.on('warning', (err) => {
        console.error('[TORRENT_SERVICE]', `[${torrent.infoHash}]`, err.toString())
      })

      torrent.on('error', (err) => {
        console.error('[TORRENT_SERVICE]', `[${torrent.infoHash}]`, err.toString())
      })

      torrent.on('wire', (wire: Wire, addr?: string) => {
        console.log(
          '[TORRENT_SERVICE]',
          `[${torrent.infoHash}]`,
          `Wire/Addr: ${wire.peerId}, ${addr}`
        )
      })

      torrent.on('noPeers', (announceType: 'tracker' | 'dht') => {
        console.log('[TORRENT_SERVICE]', `[${torrent.infoHash}]`, `No peers: ${announceType}`)
      })
    } else {
      console.error('[TORRENT_SERVICE]', 'Incorrect torrent info hash')
    }
  }

  async remove(infoHash: string): Promise<void> {
    console.log('[TORRENT_SERVICE]', 'Remove torrent:', infoHash)
    const torrent = this.ctx.client.torrents.find((t) => t.infoHash === infoHash)
    if (!torrent) return

    await this.storage.removeTorrent(infoHash)
    torrent.destroy()
  }

  getActiveCount(): number {
    return this.ctx.client.torrents.filter((t) => !t.done).length
  }

  destroy(): void {
    this.ctx.client.destroy()
  }

  checkActiveTorrents(): void {
    const downloadingItems = this.storage.getDownloadingItems()
    if (downloadingItems.length > 0) {
      console.log('[TORRENT_SERVICE]', 'Adding saved torrents:', downloadingItems.length)
      downloadingItems.forEach((downloadingItem: DownloadingItem) =>
        this.addExists(downloadingItem.magnetURI)
      )
    }
  }
}

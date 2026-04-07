import { ipcMain } from 'electron'
import { TorrentService } from '../services/torrentService'
import { ipc } from '@shared/vars'

export function registerTorrentIpc(torrent: TorrentService) {
  ipcMain.handle(ipc.torrentGet, () => {
    return torrent.getTorrents()
  })

  ipcMain.handle(ipc.torrentGetActive, () => {
    return torrent.getTorrentsActive()
  })

  ipcMain.on(ipc.torrentAdd, async (_, magnet) => {
    await torrent.add(magnet)
  })

  ipcMain.on(ipc.torrentAddExists, (_, magnet) => {
    torrent.addExists(magnet)
  })

  ipcMain.on(ipc.torrentRemove, async (_, hash) => {
    await torrent.remove(hash)
  })
}

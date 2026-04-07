import { TorrentService } from '@main/services/torrentService'
import { WindowService } from '@main/services/windowService'
import { ipc } from '@shared/vars'

const UPDATE_INTERVAL = 200

export class UpdateService {
  private interval: NodeJS.Timeout | null = null

  constructor(
    private torrent: TorrentService,
    private window: WindowService
  ) {}

  start() {
    this.interval = setInterval(() => {
      this.window.send(ipc.torrentUpdate, this.torrent.getTorrents())
      this.window.send(ipc.torrentGetActive, this.torrent.getTorrentsActive())
    }, UPDATE_INTERVAL)
  }

  stop() {
    if (this.interval) clearInterval(this.interval)
  }
}

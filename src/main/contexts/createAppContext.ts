import { AppContext } from '@shared/types'
import { BrowserWindow } from 'electron/main'
import { join } from 'node:path'
import icon from '../../../resources/icon.png?asset'
import WebTorrent from 'webtorrent'
import fs from 'node:fs/promises'

async function getVersion(): Promise<string> {
  const contents = await fs.readFile(join(__dirname, '../../package.json'), { encoding: 'utf-8' })
  const data = JSON.parse(contents)
  return data['version']
}

export async function createAppContext(WebTorrentClass: typeof WebTorrent): Promise<AppContext> {
  const client = new WebTorrentClass({
    utp: false,
    dht: {
      bootstrap: [
        'router.bittorrent.com:6881',
        'dht.transmissionbt.com:6881',
        'router.utorrent.com:6881',
        'dht.aelitis.com:6881',
        'bootstrap.jmp0.ch:6881',
        'bootstrap.epoxate.com:6881'
      ]
    }
  })
  const version = await getVersion()
  const mainWindow = new BrowserWindow({
    title: `Repos ${version}`,
    width: 1200,
    height: 720,
    minWidth: 1200,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  return {
    client,
    mainWindow
  }
}

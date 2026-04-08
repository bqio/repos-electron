import { BrowserWindow } from 'electron/main'
import { Instance } from 'webtorrent'

export interface WebClientTorrent {
  name: string | null
  infoHash: string
  magnetURI: string | null
  timeRemaining: number
  received: number
  downloaded: number
  uploaded: number
  downloadSpeed: number
  uploadSpeed: number
  progress: number
  path: string
  ready: boolean
  paused: boolean
  done: boolean
  length: number
  numPeers: number
}

export interface Torrent extends WebClientTorrent {
  poster: string
}

export type Settings = {
  downloadPath: string
  language: string
  theme: string
}

export type AppContext = {
  client: Instance
  mainWindow: BrowserWindow
}

export type DownloadingItem = {
  magnetURI: string
  infoHash: string | null
}

export type RepositoryItem = {
  title: string
  magnetURI: string
  poster: string
  size: number
  published_date: number
}

export type RepoType = 'local' | 'remote'

export type Repository = {
  id: string
  name: string
  version: string
  description: string
  author: string
  items: RepositoryItem[]
  type?: RepoType
  url?: string
}

export type Storage = {
  repository: string | null
  repositories: Repository[]
  favorites: RepositoryItem[]
  downloading: DownloadingItem[]
  settings: Settings
}

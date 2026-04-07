import { Settings } from '@shared/types'
import { ipc } from '@shared/vars'
import { create } from 'zustand'

type Theme = 'system' | 'light' | 'dark'
type Language = 'en' | 'ru'

type SettingsStore = {
  theme: Theme
  language: Language
  downloadPath: string
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  setDownloadPath: (path: string) => void
  selectDownloadDir: () => void
  init: () => Promise<void>
  saveSettings: () => void
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  theme: 'system',
  language: 'en',
  downloadPath: '',
  setTheme: (theme: Theme) => {
    set({ theme })
    get().saveSettings()
  },
  setLanguage: (language: Language) => {
    set({ language })
    get().saveSettings()
  },
  setDownloadPath: (path: string) => {
    set({ downloadPath: path })
    get().saveSettings()
  },
  init: async () => {
    const settings: Settings = await window.electron.ipcRenderer.invoke(ipc.storageGetSettings)
    set({
      theme: settings.theme as Theme,
      language: settings.language as Language,
      downloadPath: settings.downloadPath
    })
  },
  saveSettings: () => {
    const { theme, language, downloadPath } = get()
    window.electron.ipcRenderer.send(ipc.storageSetSettings, {
      theme,
      language,
      downloadPath
    } as Settings)
  },
  selectDownloadDir: async () => {
    const selectedDir: string | null = await window.electron.ipcRenderer.invoke(ipc.windowSelectDir)
    if (selectedDir) {
      get().setDownloadPath(selectedDir)
    }
  }
}))

import { Route, Routes } from 'react-router'
import { TooltipProvider } from '@renderer/components/ui/tooltip'
import { SidebarInset, SidebarProvider } from '@renderer/components/ui/sidebar'
import { AppSidebar } from '@renderer/components/AppSidebar'

import { RepoPage } from '@renderer/pages/RepoPage'
import { FavoritesPage } from '@renderer/pages/FavoritesPage'
import { DownloadsPage } from '@renderer/pages/DownloadsPage'
import { SettingsPage } from '@renderer/pages/SettingsPage'
import { useSettingsStore } from '@renderer/stores/settings'
import { useEffect, useState } from 'react'
import { Toaster } from '@renderer/components/ui/sonner'
import { useRepoStore } from '@renderer/stores/repo'
import { PhotoProvider } from 'react-photo-view'

function App(): React.JSX.Element {
  const initSettings = useSettingsStore((s) => s.init)
  const initRepos = useRepoStore((s) => s.init)
  const theme = useSettingsStore((s) => s.theme)
  const [_, setActualTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    initSettings()
    initRepos()
  }, [initSettings, initRepos])

  const getActualTheme = (themeSetting: string): 'light' | 'dark' => {
    if (themeSetting === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return themeSetting as 'light' | 'dark'
  }

  useEffect(() => {
    const updateTheme = () => {
      const newActualTheme = getActualTheme(theme)
      setActualTheme(newActualTheme)

      // Удаляем предыдущие классы темы
      document.body.classList.remove('light', 'dark')
      // Добавляем текущую тему
      document.body.classList.add(newActualTheme)
    }

    updateTheme()

    // Слушаем изменения системной темы, если выбран режим 'system'
    let mediaQuery: MediaQueryList | null = null
    let handler: ((e: MediaQueryListEvent) => void) | null = null

    if (theme === 'system') {
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      handler = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light'
        setActualTheme(newTheme)
        document.body.classList.remove('light', 'dark')
        document.body.classList.add(newTheme)
      }
      mediaQuery.addEventListener('change', handler)
    }

    return () => {
      if (mediaQuery && handler) {
        mediaQuery.removeEventListener('change', handler)
      }
    }
  }, [theme])
  return (
    <>
      <TooltipProvider>
        <PhotoProvider>
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <SidebarInset>
              <Routes>
                <Route path="/" element={<RepoPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/downloads" element={<DownloadsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </SidebarInset>
          </SidebarProvider>
          <Toaster closeButton={true} />
        </PhotoProvider>
      </TooltipProvider>
    </>
  )
}

export default App

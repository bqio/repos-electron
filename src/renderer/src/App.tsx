import { Route, Routes } from 'react-router'
import { TooltipProvider } from '@renderer/components/ui/tooltip'
import { SidebarInset, SidebarProvider } from '@renderer/components/ui/sidebar'
import { AppSidebar } from '@renderer/components/AppSidebar'

import { RepoPage } from '@renderer/pages/RepoPage'
import { FavoritesPage } from '@renderer/pages/FavoritesPage'
import { DownloadsPage } from '@renderer/pages/DownloadsPage'
import { SettingsPage } from '@renderer/pages/SettingsPage'
import { useSettingsStore } from '@renderer/stores/settings'
import { useEffect } from 'react'
import { Toaster } from '@renderer/components/ui/sonner'

function App(): React.JSX.Element {
  const initSettings = useSettingsStore((s) => s.init)

  useEffect(() => {
    initSettings()
  }, [initSettings])
  return (
    <TooltipProvider>
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
      <Toaster />
    </TooltipProvider>
  )
}

export default App

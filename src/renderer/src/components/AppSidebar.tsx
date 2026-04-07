import * as React from 'react'
import { Archive, Download, Settings, Star } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@renderer/components/ui/sidebar'
import { Link, useLocation } from 'react-router'
import { Badge } from '@renderer/components/ui/badge'
import { useEffect } from 'react'
import { WebClientTorrent } from '@shared/types'
import { ipc } from '@shared/vars'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>): React.JSX.Element {
  const location = useLocation()
  const [downloadCount, setDownloadCount] = React.useState<number | null>(null)
  const renderer = window.electron.ipcRenderer

  useEffect(() => {
    function handler(_: unknown, webTorrents: WebClientTorrent[]): void {
      setDownloadCount(webTorrents.length)
    }

    renderer.on(ipc.torrentGetActive, handler)

    return () => {
      renderer.removeAllListeners(ipc.torrentGetActive)
    }
  }, [renderer])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-1">
            <SidebarMenuItem>
              <Link to="/">
                <SidebarMenuButton isActive={location.pathname === '/'}>
                  <Archive />
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/favorites">
                <SidebarMenuButton isActive={location.pathname === '/favorites'}>
                  <Star />
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link to="/downloads">
                <SidebarMenuButton isActive={location.pathname === '/downloads'}>
                  <Download />
                  {downloadCount && (
                    <Badge
                      variant="default"
                      className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 absolute w-2.5 h-4 -right-1 top-4"
                    >
                      {downloadCount}
                    </Badge>
                  )}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/settings">
              <SidebarMenuButton isActive={location.pathname === '/settings'}>
                <Settings />
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

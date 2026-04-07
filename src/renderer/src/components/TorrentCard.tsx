import { useState, useEffect } from 'react'
import { Card } from '@renderer/components/ui/card'
import { Button } from '@renderer/components/ui/button'
import { X, ArrowDown, ArrowUp, Users, Clock, FolderOpen } from 'lucide-react'
import { cn } from '@renderer/lib/utils'
import { ipc } from '@shared/vars'

interface TorrentCardProps {
  title: string
  poster: string
  size: string
  downloaded: string
  progress: number
  downloadSpeed: string
  uploadSpeed: string
  peers: number
  eta: string
  status: 'downloading' | 'paused' | 'seeding' | 'completed'
  infoHash: string
}

export function TorrentCard({
  title,
  poster,
  size,
  downloaded,
  progress: initialProgress,
  downloadSpeed,
  uploadSpeed,
  peers,
  eta,
  status: initialStatus,
  infoHash
}: TorrentCardProps): React.JSX.Element {
  const renderer = window.electron.ipcRenderer
  const [progress, setProgress] = useState(initialProgress)
  const [status, setStatus] = useState(initialStatus)

  useEffect(() => {
    setProgress(initialProgress)
  }, [initialProgress])

  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  function handleRemoveTorrent(infoHash: string): void {
    renderer.send(ipc.torrentRemove, infoHash)
  }

  function handleOpenDownloadsDirectory(infoHash: string): void {
    renderer.send(ipc.storageOpenDir, infoHash)
  }

  const getStatusColor = (): string => {
    switch (status) {
      case 'downloading':
        return 'bg-primary'
      case 'seeding':
        return 'bg-accent'
      case 'completed':
        return 'bg-chart-1'
      case 'paused':
        return 'bg-muted-foreground'
      default:
        return 'bg-primary'
    }
  }

  const getStatusBadge = (): string => {
    switch (status) {
      case 'downloading':
        return 'Downloading'
      case 'seeding':
        return 'Seeding'
      case 'completed':
        return 'Completed'
      case 'paused':
        return 'Paused'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card className="group relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="flex gap-4 px-4">
        {/* Poster */}
        <div className="relative h-40 w-24 shrink-0 overflow-hidden rounded-lg">
          <img
            src={poster}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
          <div
            className={cn(
              'absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-medium',
              status === 'downloading' && 'bg-primary/20 text-primary',
              status === 'paused' && 'bg-muted text-muted-foreground',
              status === 'seeding' && 'bg-accent/20 text-accent',
              status === 'completed' && 'bg-chart-1/20 text-chart-1'
            )}
          >
            {getStatusBadge()}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {downloaded} / {size}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground">{progress.toFixed(1)}%</span>
              {status === 'downloading' && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {eta}
                </span>
              )}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className={cn('h-full rounded-full transition-all duration-300', getStatusColor())}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <ArrowDown className="h-3 w-3 text-primary" />
              <span>{downloadSpeed}</span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              <span>{uploadSpeed}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{peers}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => handleRemoveTorrent(infoHash)}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            variant="ghost"
            size="icon"
            onClick={() => handleOpenDownloadsDirectory(infoHash)}
          >
            <FolderOpen className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}

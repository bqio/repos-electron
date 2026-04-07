/* eslint-disable react-hooks/set-state-in-effect */
import { DownloadsPageSkeleton } from '@renderer/components/skeleton/DownloadsPageSkeleton'
import { StatsCard } from '@renderer/components/StatsCard'
import { TorrentCard } from '@renderer/components/TorrentCard'
import { Button } from '@renderer/components/ui/button'
import { Input } from '@renderer/components/ui/input'
import { Torrent, type WebClientTorrent } from '@shared/types'
import { ipc } from '@shared/vars'
import { ArrowDown, ArrowUp, FolderOpen } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'

export function DownloadsPage(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(true)
  const [isDebug] = useState(false)
  const [inputMagnet, setInputMagnet] = useState(
    'magnet:?xt=urn:btih:FF805117D5E6258BA71A21BDB9A322CBE0338FA0&tr=http%3A%2F%2Fbt4.t-ru.org%2Fann%3Fmagnet&dn=%D0%9D%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%B0%D1%8F%20%D0%B1%D0%B0%D0%B7%D0%B0%20%D1%80%D0%B0%D0%B7%D0%B4%D0%B0%D1%87%20RuTracker.ORG%20v.%2020260329'
  )
  const [torrents, setTorrents] = useState<Torrent[]>([])

  const [peakDownloadSpeed, setPeakDownloadSpeed] = useState(0)
  const [peakUploadSpeed, setPeakUploadSpeed] = useState(0)

  const renderer = window.electron.ipcRenderer
  const oneGB = 1024 * 1024 * 1024
  const oneMB = 1024 * 1024
  const oneKB = 1024

  function handleButtonClick(): void {
    renderer.send(ipc.torrentAdd, inputMagnet)
  }

  function handleOpenDownloadsDirectory(): void {
    renderer.send(ipc.storageOpenDownloadsDir)
  }

  useEffect(() => {
    function handler(_: unknown, webTorrents: WebClientTorrent[]): void {
      const mapped: Torrent[] = webTorrents.map((t) => ({
        ...t,
        poster: 'https://images.vfl.ru/ii/1579891604/67e7f086/29313143.png'
      }))

      setTorrents(mapped)
      setIsLoading(false)
    }

    renderer.on(ipc.torrentUpdate, handler)

    return () => {
      renderer.removeAllListeners(ipc.torrentUpdate)
    }
  }, [renderer])

  const totalDownloadSpeed = useMemo(() => {
    return torrents.reduce((sum, t) => sum + t.downloadSpeed, 0)
  }, [torrents])

  const totalUploadSpeed = useMemo(() => {
    return torrents.reduce((sum, t) => sum + t.uploadSpeed, 0)
  }, [torrents])

  useEffect(() => {
    setPeakDownloadSpeed((prev) => (totalDownloadSpeed > prev ? totalDownloadSpeed : prev))
  }, [totalDownloadSpeed])

  useEffect(() => {
    setPeakUploadSpeed((prev) => (totalUploadSpeed > prev ? totalUploadSpeed : prev))
  }, [totalUploadSpeed])

  const activeTorrentsCount = useMemo(() => {
    return torrents.filter((t) => {
      return !t.done && !t.paused && t.length
    }).length
  }, [torrents])

  const totalProgress = useMemo(() => {
    if (torrents.length === 0) return 0

    const totalDownloaded = torrents.reduce((sum, t) => sum + (t.downloaded || 0), 0)
    const totalSize = torrents.reduce((sum, t) => sum + (t.length || 0), 0)

    return totalSize === 0 ? 0 : (totalDownloaded / totalSize) * 100
  }, [torrents])

  function getSize(size: number): string {
    if (!size) return '0 B'
    if (size > oneGB) return `${(size / oneGB).toFixed(1)} GB`
    if (size > oneMB) return `${(size / oneMB).toFixed(1)} MB`
    if (size > oneKB) return `${(size / oneKB).toFixed(1)} KB`
    return `${Math.round(size)} B`
  }

  function getSpeed(speed: number): string {
    if (!speed) return '0 B/s'
    if (speed > oneGB) return `${(speed / oneGB).toFixed(1)} GB/s`
    if (speed > oneMB) return `${(speed / oneMB).toFixed(1)} MB/s`
    if (speed > oneKB) return `${(speed / oneKB).toFixed(1)} KB/s`
    return `${Math.round(speed)} B/s`
  }

  function getProgress(downloaded: number, total: number): number {
    if (!total) return 0
    return (downloaded / total) * 100
  }

  return (
    <>
      {!isLoading ? (
        <div>
          {isDebug && (
            <div className="flex gap-2 p-6 pb-0">
              <Input value={inputMagnet} onChange={(e) => setInputMagnet(e.target.value)} />
              <Button onClick={handleButtonClick}>Add Torrent</Button>
            </div>
          )}

          <div className="p-6 grid grid-cols-2 gap-6">
            <StatsCard
              title="Download Speed"
              value={getSpeed(totalDownloadSpeed)}
              subtitle={`Peak: ${getSpeed(peakDownloadSpeed)}`}
              icon={<ArrowDown className="h-5 w-5" />}
            />
            <StatsCard
              title="Upload Speed"
              value={getSpeed(totalUploadSpeed)}
              subtitle={`Peak: ${getSpeed(peakUploadSpeed)}`}
              icon={<ArrowUp className="h-5 w-5" />}
            />
          </div>

          <div className="p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Active Downloads</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeTorrentsCount} torrents in queue • Total progress: {totalProgress.toFixed(1)}
                %
              </p>
            </div>
            <Button
              className="text-muted-foreground hover:text-destructive"
              variant="ghost"
              onClick={handleOpenDownloadsDirectory}
            >
              <FolderOpen className="h-4 w-4" />
              Downloads
            </Button>
          </div>

          <div className="p-6 pt-0 grid grid-cols-2 gap-6">
            {torrents.map((torrent) => (
              <TorrentCard
                key={torrent.infoHash}
                title={torrent.name!}
                poster={torrent.poster}
                size={getSize(torrent.length)}
                downloaded={getSize(torrent.downloaded)}
                progress={getProgress(torrent.downloaded, torrent.length)}
                downloadSpeed={getSpeed(torrent.downloadSpeed)}
                uploadSpeed={getSpeed(torrent.uploadSpeed)}
                peers={torrent.numPeers || 0}
                eta={formatTimeRemaining(torrent.timeRemaining)}
                status={torrent.done ? 'completed' : torrent.paused ? 'paused' : 'downloading'}
                infoHash={torrent.infoHash}
              />
            ))}
          </div>
        </div>
      ) : (
        <DownloadsPageSkeleton />
      )}
    </>
  )
}

function formatTimeRemaining(timeRemaining: number): string {
  if (!timeRemaining || timeRemaining === Infinity) return '∞'

  const seconds = Math.floor(timeRemaining / 1000)
  if (seconds === 0) return 'Completed'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react'
import { PosterImage } from '@renderer/components/PosterImage'
import { File, Calendar, Hash, Download } from 'lucide-react'
import { Skeleton } from '@renderer/components/ui/skeleton'
import { Button } from '@renderer/components/ui/button'
import { Separator } from '@renderer/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@renderer/components/ui/dialog'
import { ButtonGroup } from '@renderer/components/ui/button-group'
import { RepositoryItem } from '@shared/types'
import { toast } from 'sonner'
import { ipc } from '@shared/vars'
import { getInfoHashFromMagnet } from '@shared/utils'
import { ItemScreenshots } from '@renderer/components/ItemScreenshots'

interface PosterGridProps {
  items: RepositoryItem[]
}

const ITEMS_PER_PAGE = 35

// Выносим форматтеры за компонент
const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return '—'

  const tb = bytes / (1024 * 1024 * 1024 * 1024)
  if (tb >= 1) {
    if (tb >= 100) return `${Math.round(tb)} TB`
    if (tb >= 10) return `${tb.toFixed(1)} TB`
    return `${tb.toFixed(2)} TB`
  }

  const gb = bytes / (1024 * 1024 * 1024)
  if (gb >= 1) {
    if (gb >= 100) return `${Math.round(gb)} GB`
    if (gb >= 10) return `${gb.toFixed(1)} GB`
    return `${gb.toFixed(2)} GB`
  }

  const mb = bytes / (1024 * 1024)
  if (mb >= 100) return `${Math.round(mb)} MB`
  if (mb >= 10) return `${mb.toFixed(1)} MB`
  return `${mb.toFixed(2)} MB`
}

const formatDate = (timestamp?: number): string => {
  if (!timestamp) return '—'

  try {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return '—'
  }
}

// Мемоизированный компонент постера
const PosterItem = memo(
  ({
    item,
    onItemClick
  }: {
    item: RepositoryItem
    onItemClick: (item: RepositoryItem) => void
  }) => {
    const handleClick = useCallback(() => onItemClick(item), [item, onItemClick])

    return (
      <div className="cursor-pointer flex flex-col gap-2" onClick={handleClick}>
        <PosterImage src={item.poster} alt={item.title} />

        <h3
          className="text-sm font-medium truncate text-foreground px-1 mt-auto"
          title={item.title}
        >
          {item.title}
        </h3>
      </div>
    )
  }
)

PosterItem.displayName = 'PosterItem'

// Мемоизированный компонент InfoRow
export const InfoRow = memo(
  ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) => (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <span className="text-xs text-muted-foreground block">{label}</span>
        <span className="text-sm font-medium block truncate" title={String(value)}>
          {value}
        </span>
      </div>
    </div>
  )
)

InfoRow.displayName = 'InfoRow'

// Основной компонент
export function PosterGrid({ items }: PosterGridProps) {
  const [displayedItems, setDisplayedItems] = useState<RepositoryItem[]>([])
  const [page, setPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState<RepositoryItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const renderer = window.electron.ipcRenderer

  const handleItemDownloadClick = useCallback(
    (item: RepositoryItem): void => {
      setDialogOpen(false)
      toast.success(`Downloading ${item.title}...`, { icon: <Download size="sm" /> })
      renderer.send(ipc.torrentAdd, item.magnetURI)
    },
    [renderer]
  )

  const handleItemClick = useCallback((item: RepositoryItem) => {
    setSelectedItem(item)
    setDialogOpen(true)
  }, [])

  const handleDialogClose = useCallback(() => {
    setDialogOpen(false)
    setSelectedItem(null)
  }, [])

  // Мемоизированные значения
  const hasMoreItems = useMemo(
    () => displayedItems.length < items.length,
    [displayedItems.length, items.length]
  )

  // Сброс пагинации при изменении items
  useEffect(() => {
    setDisplayedItems(items.slice(0, ITEMS_PER_PAGE))
    setPage(1)
  }, [items])

  // Оптимизированный Intersection Observer
  useEffect(() => {
    if (!hasMoreItems) return

    const loadMore = () => {
      const nextPage = page + 1
      const newItems = items.slice(0, nextPage * ITEMS_PER_PAGE)
      setDisplayedItems(newItems)
      setPage(nextPage)
    }

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreItems) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentLoader = loaderRef.current
    if (currentLoader) {
      observerRef.current.observe(currentLoader)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMoreItems, items, page])

  // Одиночный скелетон
  const PosterSkeleton = useMemo(
    () => () => (
      <div className="animate-pulse">
        <div className="aspect-2/3 relative mb-2">
          <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
        </div>
        <Skeleton className="h-4 w-full mt-2 rounded" />
      </div>
    ),
    []
  )

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(136px,1fr))] gap-6">
        {displayedItems.map((item) => (
          <PosterItem
            key={getInfoHashFromMagnet(item.magnetURI)}
            item={item}
            onItemClick={handleItemClick}
          />
        ))}
      </div>

      {hasMoreItems && (
        <div ref={loaderRef} className="py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <PosterSkeleton key={`loading-skeleton-${i}`} />
            ))}
          </div>
        </div>
      )}

      {/* Единственный Dialog для выбранного элемента */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
        {selectedItem && (
          <DialogContent
            className="min-w-3xl p-0"
            onCloseAutoFocus={(e) => e.preventDefault()}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onPointerDownOutside={(e) => {
              const target = e.target as HTMLElement
              if (target.closest('[data-slot="dialog-overlay"]')) {
                e.preventDefault()
              }
            }}
          >
            <div className="grid grid-cols-12">
              <div className="bg-muted/30 p-8 flex items-center justify-center col-span-4">
                <PosterImage src={selectedItem.poster} alt={selectedItem.title} />
              </div>

              <div className="p-6 col-span-8 flex flex-col">
                <DialogHeader className="text-left p-0">
                  <DialogTitle
                    className="text-md font-semibold leading-tight truncate max-w-sm"
                    title={selectedItem.title}
                  >
                    {selectedItem.title}
                  </DialogTitle>
                </DialogHeader>

                <Separator className="my-4" />

                <div className="space-y-1">
                  {selectedItem.size && (
                    <InfoRow icon={File} label="Size" value={formatFileSize(selectedItem.size)} />
                  )}

                  {selectedItem.published_date && (
                    <InfoRow
                      icon={Calendar}
                      label="Published"
                      value={formatDate(selectedItem.published_date)}
                    />
                  )}

                  {selectedItem.magnetURI && (
                    <InfoRow
                      icon={Hash}
                      label="Hash"
                      value={getInfoHashFromMagnet(selectedItem.magnetURI)!}
                    />
                  )}
                </div>

                {selectedItem.screenshots && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <ItemScreenshots urls={selectedItem.screenshots} />
                  </div>
                )}

                <div className="flex justify-end mt-auto">
                  <ButtonGroup>
                    <Button variant="outline" onClick={() => handleItemDownloadClick(selectedItem)}>
                      <Download />
                      Download
                    </Button>
                    <Button variant="outline" disabled>
                      <Download />
                      Like
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}

import { StatsCardSkeleton } from '@renderer/components/skeleton/StatsCardSkeleton'
import { Skeleton } from '@renderer/components/ui/skeleton'
import { ArrowDown, ArrowUp } from 'lucide-react'

export function DownloadsPageSkeleton(): React.JSX.Element {
  return (
    <>
      <div className="p-6 grid grid-cols-2 gap-6">
        <StatsCardSkeleton title="Download Speed" icon={<ArrowDown className="h-5 w-5" />} />
        <StatsCardSkeleton title="Upload Speed" icon={<ArrowUp className="h-5 w-5" />} />
      </div>

      <div className="p-6">
        <h2 className="text-xl font-semibold">Active Downloads</h2>
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
    </>
  )
}

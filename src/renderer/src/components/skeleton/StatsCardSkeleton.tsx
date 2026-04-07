import { Card } from '@renderer/components/ui/card'
import { Skeleton } from '@renderer/components/ui/skeleton'

interface StatsCardSkeletonProps {
  title: string
  icon: React.ReactNode
}

export function StatsCardSkeleton({ title, icon }: StatsCardSkeletonProps): React.JSX.Element {
  return (
    <Card className="border-border/50 bg-card/80 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <Skeleton className="h-8 w-16 mt-2" />
          <Skeleton className="h-4 w-16 mt-2" />
        </div>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
      </div>
    </Card>
  )
}

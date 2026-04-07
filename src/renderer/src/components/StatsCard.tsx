import { Card } from '@renderer/components/ui/card'
import { cn } from '@renderer/lib/utils'

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ReactNode
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon,
  className
}: StatsCardProps): React.JSX.Element {
  return (
    <Card
      className={cn(
        'border-border/50 bg-card/80 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/30',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
      </div>
    </Card>
  )
}

import { Button } from '@renderer/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@renderer/components/ui/empty'
import { Star } from 'lucide-react'
import { Link } from 'react-router'

export function EmptyFavorites(): React.JSX.Element {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Star />
        </EmptyMedia>
        <EmptyTitle>No Favorites</EmptyTitle>
        <EmptyDescription>Click the like button on any item to add it here</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link to="/">
          <Button variant="outline" size="sm">
            Like
          </Button>
        </Link>
      </EmptyContent>
    </Empty>
  )
}

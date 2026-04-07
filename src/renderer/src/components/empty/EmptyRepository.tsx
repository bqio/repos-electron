import { Button } from '@renderer/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@renderer/components/ui/empty'
import { Archive } from 'lucide-react'
import { Link } from 'react-router'

export function EmptyRepository(): React.JSX.Element {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Archive />
        </EmptyMedia>
        <EmptyTitle>No Repository</EmptyTitle>
        <EmptyDescription>Import a repository to start managing your items</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link to="/settings#repositories">
          <Button variant="outline" size="sm">
            Import
          </Button>
        </Link>
      </EmptyContent>
    </Empty>
  )
}

import { Button } from '@renderer/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@renderer/components/ui/empty'
import { CloudDownload } from 'lucide-react'
import { Link } from 'react-router'

export function EmptyDownloads(): React.JSX.Element {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CloudDownload />
        </EmptyMedia>
        <EmptyTitle>No Downloads</EmptyTitle>
        <EmptyDescription>Download something to get started.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link to="/">
          <Button variant="outline" size="sm">
            Download
          </Button>
        </Link>
      </EmptyContent>
    </Empty>
  )
}

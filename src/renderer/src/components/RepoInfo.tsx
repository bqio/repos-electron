import { InfoRow } from '@renderer/components/PosterGrid'
import { Card, CardContent } from '@renderer/components/ui/card'
import { Repository } from '@shared/types'
import { FolderPen, GitCommitHorizontal, Info, LayoutList, User } from 'lucide-react'

interface RepoInfoProps {
  repository: Repository
}

export function RepoInfo({ repository }: RepoInfoProps) {
  return (
    <Card>
      <CardContent>
        <InfoRow icon={FolderPen} label="Name" value={repository.name} />
        <InfoRow icon={Info} label="Description" value={repository.description} />
        <InfoRow icon={User} label="Author" value={repository.author} />
        <InfoRow icon={GitCommitHorizontal} label="Version" value={repository.version} />
        <InfoRow icon={LayoutList} label="Items Count" value={repository.items.length} />
      </CardContent>
    </Card>
  )
}

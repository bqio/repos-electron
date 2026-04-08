import { PosterGrid } from '@renderer/components/PosterGrid'
import { Repository } from '@shared/types'

interface RepoViewerProps {
  repository: Repository
}

export function RepoViewer(props: RepoViewerProps): React.JSX.Element {
  return (
    <div className="p-6 grid grid-cols-12">
      <main className="col-span-9 mr-6">
        <PosterGrid items={props.repository.items} />
      </main>
      <aside className="col-span-3"></aside>
    </div>
  )
}

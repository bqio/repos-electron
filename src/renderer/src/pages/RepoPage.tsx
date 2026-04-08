import { EmptyRepository } from '@renderer/components/empty/EmptyRepository'
import { RepoViewer } from '@renderer/components/RepoViewer'
import { useRepoStore } from '@renderer/stores/repo'

export function RepoPage(): React.JSX.Element {
  const repositories = useRepoStore((s) => s.repositories)
  const repoId = useRepoStore((s) => s.repository)
  const repository = repositories.find((r) => r.id === repoId)
  return <>{repository ? <RepoViewer repository={repository} /> : <EmptyRepository />}</>
}

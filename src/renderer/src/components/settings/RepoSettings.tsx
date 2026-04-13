import ImportRepoDialog from '@renderer/components/dialogs/ImportRepoDialog'
import { DataTable } from '@renderer/components/tables/DataTable'
import { Badge } from '@renderer/components/ui/badge'
import { Button } from '@renderer/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@renderer/components/ui/dropdown-menu'
import { useRepoStore } from '@renderer/stores/repo'
import { Repository } from '@shared/types'
import { ColumnDef } from '@tanstack/react-table'
import { BadgeCheck, Cloud, MoreHorizontal, RefreshCcw, Trash2, File } from 'lucide-react'

export function RepoSettings(): React.JSX.Element {
  const repoId = useRepoStore((s) => s.repository)
  const repositories = useRepoStore((s) => s.repositories)
  const setRepo = useRepoStore((s) => s.setRepo)
  const removeRepo = useRepoStore((s) => s.removeRepo)

  const currentRepository = repositories.find((r) => r.id === repoId)

  const columns: ColumnDef<Repository>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => {
        const repository = row.original
        const isActive = currentRepository?.name === repository.name
        const isLocal = repository.type === 'local'

        return (
          <div className="flex items-center gap-2">
            <span>{repository.name}</span>
            {isActive && (
              <Badge
                variant="default"
                className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
              >
                <BadgeCheck className="h-3 w-3" />
                Active
              </Badge>
            )}
            {isLocal ? (
              <Badge variant="destructive">
                <File />
                Local
              </Badge>
            ) : (
              <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                <Cloud />
                Remote
              </Badge>
            )}
          </div>
        )
      }
    },
    {
      accessorKey: 'version',
      header: 'Version'
    },
    {
      accessorKey: 'description',
      header: 'Description'
    },
    {
      accessorKey: 'author',
      header: 'Author'
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const repository = row.original
        const isActive = currentRepository?.name === repository.name
        const isLocal = repository.type === 'local'
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled={isActive} onClick={() => setRepo(repository.id)}>
                <BadgeCheck />
                Activate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled={isLocal}>
                <RefreshCcw />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => removeRepo(repository.name, repository.version)}>
                <Trash2 />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    }
  ]
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Repositories</CardTitle>
          <CardDescription>Manage your repositories</CardDescription>
          <CardAction>
            <ImportRepoDialog />
          </CardAction>
        </CardHeader>
        {repositories.length > 0 && (
          <CardContent>
            <DataTable columns={columns} data={repositories} />
          </CardContent>
        )}
      </Card>
    </>
  )
}

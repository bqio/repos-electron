import ImportRepoDialog from '@renderer/components/dialogs/ImportRepoDialog'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'

export function RepoSettings(): React.JSX.Element {
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
      </Card>
    </>
  )
}

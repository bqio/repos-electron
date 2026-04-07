import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'
import { useLocation } from 'react-router'
import { GeneralSettings } from '@renderer/components/settings/GeneralSettings'
import { RepoSettings } from '@renderer/components/settings/RepoSettings'

export function SettingsPage(): React.JSX.Element {
  const location = useLocation()

  return (
    <div className="p-6">
      <Tabs defaultValue={location.hash || 'general'}>
        <TabsList variant="line">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="#repositories">Repositories</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="py-4 flex flex-col gap-6">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="#repositories" className="py-4 flex flex-col gap-6">
          <RepoSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { Button } from '@renderer/components/ui/button'
import { ButtonGroup } from '@renderer/components/ui/button-group'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@renderer/components/ui/card'
import { Field } from '@renderer/components/ui/field'
import { Input } from '@renderer/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { useSettingsStore } from '@renderer/stores/settings'
import { FolderOpen } from 'lucide-react'

export function GeneralSettings(): React.JSX.Element {
  const theme = useSettingsStore((s) => s.theme)
  const setTheme = useSettingsStore((s) => s.setTheme)
  const language = useSettingsStore((s) => s.language)
  const setLanguage = useSettingsStore((s) => s.setLanguage)
  const downloadPath = useSettingsStore((s) => s.downloadPath)
  const setDownloadPath = useSettingsStore((s) => s.setDownloadPath)
  const selectDownloadDir = useSettingsStore((s) => s.selectDownloadDir)
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Downloads Directory</CardTitle>
          <CardDescription>Select downloads directory path</CardDescription>
        </CardHeader>
        <CardContent>
          <Field>
            <ButtonGroup>
              <Input
                id="input-button-group"
                placeholder=""
                value={downloadPath}
                onChange={(e) => setDownloadPath(e.target.value)}
                disabled
              />
              <Button variant="outline" onClick={selectDownloadDir}>
                <FolderOpen />
                Open
              </Button>
            </ButtonGroup>
          </Field>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>Set application language</CardDescription>
            <CardAction>
              <Select defaultValue={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Languages</SelectLabel>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ru">Russian</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Set application color theme</CardDescription>
            <CardAction>
              <Select defaultValue={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Themes</SelectLabel>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </>
  )
}

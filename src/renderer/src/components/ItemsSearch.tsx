import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@renderer/components/ui/card'
import { Input } from '@renderer/components/ui/input'

interface ItemsSearchProps {
  searchValue: string
  setSearchValue(searchValue: string): void
}

export function ItemsSearch({ searchValue, setSearchValue }: ItemsSearchProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Поиск</CardTitle>
        <CardDescription>Ищи что нужно</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder={`Что ищем...`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          autoFocus
        />
      </CardContent>
    </Card>
  )
}

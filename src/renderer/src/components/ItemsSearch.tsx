import { Card, CardHeader, CardTitle, CardContent } from '@renderer/components/ui/card'
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
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder={`Что ищем?`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          autoFocus
        />
      </CardContent>
    </Card>
  )
}

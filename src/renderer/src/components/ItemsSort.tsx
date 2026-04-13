import { Button } from '@renderer/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@renderer/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem
} from '@renderer/components/ui/select'
import { ArrowUpDown } from 'lucide-react'

interface ItemsSortProps {
  sortValue: string
  setSortValue(sortValue: string): void
  reverseValue: boolean
  setReverseValue(reverseValue: boolean): void
}

export function ItemsSort({
  sortValue,
  setSortValue,
  reverseValue,
  setReverseValue
}: ItemsSortProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sort</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Select value={sortValue} onValueChange={setSortValue}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="date">Published Date</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setReverseValue(!reverseValue)}>
            <ArrowUpDown
              className={`h-4 w-4 transition-transform duration-200 ${
                reverseValue ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

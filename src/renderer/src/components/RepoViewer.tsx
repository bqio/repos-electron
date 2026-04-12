import { ItemsSearch } from '@renderer/components/ItemsSearch'
import { ItemsSort } from '@renderer/components/ItemsSort'
import { PosterGrid } from '@renderer/components/PosterGrid'
import { RepoInfo } from '@renderer/components/RepoInfo'
import { Repository } from '@shared/types'
import { useMemo, useState } from 'react'

interface RepoViewerProps {
  repository: Repository
}

export function RepoViewer(props: RepoViewerProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortValue, setSortValue] = useState<string>('date')
  const [reverseValue, setReverseValue] = useState<boolean>(false)

  const repository = props.repository
  const items = repository.items

  const filteredAndSortedItems = useMemo(() => {
    let result = [...items]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((item) => item.title.toLowerCase().includes(query))
    }

    result.sort((a, b) => {
      let comparison = 0
      switch (sortValue) {
        case 'date':
          comparison = (b.published_date || 0) - (a.published_date || 0)
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'size':
          comparison = (b.size || 0) - (a.size || 0)
          break
        default:
          comparison = 0
      }
      return reverseValue ? -comparison : comparison
    })

    return result
  }, [items, searchQuery, sortValue, reverseValue])

  return (
    <div className="p-6 grid grid-cols-12 gap-6">
      <main className="col-span-9">
        <PosterGrid items={filteredAndSortedItems} />
      </main>
      <aside className="col-span-3 flex flex-col gap-6 sticky top-5 self-start">
        <ItemsSearch searchValue={searchQuery} setSearchValue={setSearchQuery} />
        <ItemsSort
          sortValue={sortValue}
          setSortValue={setSortValue}
          reverseValue={reverseValue}
          setReverseValue={setReverseValue}
        />
        <RepoInfo repository={repository} />
      </aside>
    </div>
  )
}

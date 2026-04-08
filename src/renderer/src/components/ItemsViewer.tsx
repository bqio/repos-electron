import { RepositoryItem } from '@shared/types'
import { ipc } from '@shared/vars'
import { toast } from 'sonner'

interface ItemsViewerProps {
  items: RepositoryItem[]
}

export function ItemsViewer(props: ItemsViewerProps): React.JSX.Element {
  const { items } = props
  const filteredItems = items.slice(0, 20)
  const renderer = window.electron.ipcRenderer

  function handleItemClick(item: RepositoryItem): void {
    toast.success(`Downloading ${item.title}...`)
    renderer.send(ipc.torrentAdd, item.magnetURI)
  }

  return (
    <div className="grid grid-cols-4 gap-6 pr-6">
      {filteredItems.map((item) => (
        <div key={item.magnetURI}>
          <img
            src={item.poster}
            alt={item.title}
            className="cursor-pointer"
            onClick={() => handleItemClick(item)}
          />
        </div>
      ))}
    </div>
  )
}

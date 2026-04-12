import { PhotoView } from 'react-photo-view'
import { v4 } from 'uuid'

interface ItemScreenshotsProps {
  urls: string[]
}

export function ItemScreenshots(props: ItemScreenshotsProps): React.JSX.Element {
  const screenshots = props.urls

  return (
    <div className="my-6 grid grid-cols-3 gap-4">
      {screenshots.map((screenshot) => {
        const id = v4()
        return (
          <PhotoView src={screenshot} key={id}>
            <img
              src={screenshot}
              alt={id}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              className="rounded-md cursor-pointer transition"
            />
          </PhotoView>
        )
      })}
    </div>
  )
}

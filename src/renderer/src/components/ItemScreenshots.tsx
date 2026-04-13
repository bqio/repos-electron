import { ScreenshotImage } from '@renderer/components/ScreenshotImage'
import { v4 } from 'uuid'

interface ItemScreenshotsProps {
  urls: string[]
}

export function ItemScreenshots(props: ItemScreenshotsProps): React.JSX.Element {
  const screenshots = props.urls

  return (
    <div className="my-6 grid grid-cols-3 gap-4">
      {screenshots.slice(0, 3).map((screenshot) => {
        const id = v4()
        return <ScreenshotImage src={screenshot} alt={id} key={id} />
      })}
    </div>
  )
}

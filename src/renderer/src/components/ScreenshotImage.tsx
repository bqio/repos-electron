import { Skeleton } from '@renderer/components/ui/skeleton'
import { CloudOff } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { PhotoView } from 'react-photo-view'

interface ScreenshotImageProps {
  src?: string
  alt: string
  onLoad?: () => void
  className?: string
}

export function ScreenshotImage({ src, alt, className = '' }: ScreenshotImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    setIsLoaded(false)
    setHasError(false)
  }, [src])

  useEffect(() => {
    const img = imgRef.current

    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true)
    }
  }, [src])

  if (!src || hasError) {
    return (
      <div className="relative w-full h-full">
        <div className="flex h-full items-center justify-center bg-muted rounded-lg">
          <span className="text-muted-foreground text-sm">
            <CloudOff />
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {!isLoaded && <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />}
      <PhotoView src={src}>
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          className={`
            cursor-pointer
          w-full object-cover rounded-md
          transition-opacity duration-300
          ${!isLoaded ? 'opacity-0' : 'opacity-100'}
          ${className}
        `}
          loading="lazy"
          decoding="async"
        />
      </PhotoView>
    </div>
  )
}

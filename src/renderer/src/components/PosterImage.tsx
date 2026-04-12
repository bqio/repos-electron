import { Skeleton } from '@renderer/components/ui/skeleton'
import { CloudOff } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface PosterImageProps {
  src?: string
  alt: string
  onLoad?: () => void
  className?: string
}

export function PosterImage({ src, alt, className = '' }: PosterImageProps) {
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

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`
          w-full object-cover rounded-lg
          transition-opacity duration-300
          ${!isLoaded ? 'opacity-0' : 'opacity-100'}
          ${className}
        `}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

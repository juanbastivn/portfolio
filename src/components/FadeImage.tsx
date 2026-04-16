import { useState } from 'react'

interface FadeImageProps {
  src: string
  alt: string
  className?: string
}

function FadeImage({ src, alt, className }: FadeImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onLoad={() => setLoaded(true)}
      style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
    />
  )
}

export default FadeImage

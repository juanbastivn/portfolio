// BlogView.tsx
import { memo, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import styles from './BlogView.module.css'
import FadeImage from './FadeImage'
import type { ContentSection, Lang } from '../types'

const legacyAssetImports = import.meta.glob<string>(['../assets/sw_*', '../assets/icon_media.png'], {
  eager: true,
  import: 'default',
  query: '?url',
})

const legacyAssets = Object.fromEntries(
  Object.entries(legacyAssetImports).map(([path, url]) => [
    `/assets/${path.split('/').at(-1)}`,
    url,
  ]),
)

const SECTION_TITLES: Record<ContentSection, Record<Lang, string>> = {
  software: { es: 'Software', en: 'Software' },
  printing3d: { es: 'Impresión 3D', en: '3D printing' },
  media: { es: 'Media', en: 'Media' },
}

const stripFrontMatter = (markdown: string) => markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')

const mdComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => <h1 className={styles.h1}>{children}</h1>,
  h2: ({ children }: { children?: React.ReactNode }) => <h2 className={styles.h2}>{children}</h2>,
  h3: ({ children }: { children?: React.ReactNode }) => <h3 className={styles.h3}>{children}</h3>,
  p: ({ children }: { children?: React.ReactNode }) => <p className={styles.p}>{children}</p>,
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a className={styles.a} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => <ul className={styles.ul}>{children}</ul>,
  ol: ({ children }: { children?: React.ReactNode }) => <ol className={styles.ol}>{children}</ol>,
  li: ({ children }: { children?: React.ReactNode }) => <li className={styles.li}>{children}</li>,
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <FadeImage className={styles.img} src={legacyAssets[src ?? ''] ?? src ?? ''} alt={alt ?? ''} />
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className={styles.blockquote}>{children}</blockquote>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => <th className={styles.th}>{children}</th>,
  td: ({ children }: { children?: React.ReactNode }) => <td className={styles.td}>{children}</td>,
  hr: () => <hr className={styles.hr} />,
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className={styles.code}>{children}</code>
  ),
  iframe: ({ src, width, height, title }: React.IframeHTMLAttributes<HTMLIFrameElement>) => (
    <div className={styles.videoWrapper}>
      <iframe
        className={styles.iframe}
        src={src}
        width={width}
        height={height}
        title={title ?? ''}
        allowFullScreen
      />
    </div>
  ),
}

function BlogView({ section, onBack, lang = 'es' }: { section: ContentSection; onBack: () => void; lang?: Lang }) {
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${import.meta.env.BASE_URL}content/${section}.md`, {
      cache: 'no-cache',
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        return response.text()
      })
      .then((markdown) => {
        setContent(stripFrontMatter(markdown))
        setStatus('ready')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setStatus('error')
      })

    return () => controller.abort()
  }, [section])

  return (
    <div className={styles.blog}>
      <div className={`card-header ${styles.header}`}>
        <button className={`glow-border ${styles.backBtn}`} onClick={onBack}>
          {lang === 'en' ? '← Back' : '← Volver'}
        </button>
        <h1 className={`text-xl ${styles.headerTitle}`}>
          {SECTION_TITLES[section][lang]}
        </h1>
        <div className={styles.headerSpacer} />
      </div>
      <div className={styles.separator} />
      <div className={styles.markdownBody}>
        {status === 'loading' ? (
          <p className={styles.status}>{lang === 'en' ? 'Loading…' : 'Cargando…'}</p>
        ) : status === 'error' ? (
          <p className={styles.status} role="alert">
            {lang === 'en' ? 'This content could not be loaded.' : 'No se pudo cargar este contenido.'}
          </p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={mdComponents}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  )
}

export default memo(BlogView)

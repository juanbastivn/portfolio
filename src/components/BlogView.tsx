// BlogView.tsx
import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import styles from './BlogView.module.css'

// ── Asset map ─────────────────────────────────────────────────────────────────
// To use an image in a .md file write: ![alt](/assets/icon_name.png)
// Then add that same key and its import below.
import swBaudata1   from '../assets/sw_baudata1.png'
import swBaudata2   from '../assets/sw_baudata2.png'
import swNeuronat from '../assets/sw_neuronat.png'
import swDgenius1   from '../assets/sw_dgenius1.png'
import swDgenius2  from '../assets/sw_dgenius2.png'
import swDgenius3  from '../assets/sw_dgenius3.png'
import swBaches   from '../assets/sw_baches.png'

import FadeImage from './FadeImage'
import softwareMd from '../content/software.md?raw'
import mediaMd from '../content/media.md?raw'

const assetMap: Record<string, string> = {
  '/assets/sw_baudata1.png':   swBaudata1,
  '/assets/sw_baudata2.png':   swBaudata2,
  '/assets/sw_neuronat.png': swNeuronat,
  '/assets/sw_dgenius1.png':   swDgenius1,
  '/assets/sw_dgenius2.png':   swDgenius2,
  '/assets/sw_dgenius3.png':   swDgenius3,
  '/assets/sw_baches.png':   swBaches,
}
// ─────────────────────────────────────────────────────────────────────────────

const mdFiles: Record<string, string> = {
  software: softwareMd,
  media: mediaMd,
}

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
    <FadeImage className={styles.img} src={assetMap[src ?? ''] ?? src ?? ''} alt={alt ?? ''} />
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

function BlogView({ section, onBack, lang = 'es' }: { section: 'software' | 'media'; onBack: () => void; lang?: 'es' | 'en' }) {
  const content = mdFiles[section] ?? ''

  return (
    <div className={styles.blog}>
      <div className={`card-header ${styles.header}`}>
        <button className={`glow-border ${styles.backBtn}`} onClick={onBack}>
          {lang === 'en' ? '← Back' : '← Volver'}
        </button>
        <p className={`text-xl ${styles.headerTitle}`}>
          {section === 'software' ? 'Software' : 'Media'}
        </p>
        <div className={styles.headerSpacer} />
      </div>
      <div className={styles.separator} />
      <div className={styles.markdownBody}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={mdComponents}
      >
        {content}
      </ReactMarkdown>
      </div>
    </div>
  )
}

export default memo(BlogView)

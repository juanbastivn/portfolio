import { useCallback, useEffect, useState } from 'react'
import type { View } from '../types'

const VIEWS: View[] = ['home', 'software', 'printing3d', 'media', 'games']

const readView = (): View => {
  if (typeof window === 'undefined') return 'home'
  const candidate = window.location.hash.slice(1)
  return VIEWS.includes(candidate as View) ? candidate as View : 'home'
}

export function useViewNavigation() {
  const [view, setView] = useState<View>(readView)

  useEffect(() => {
    const syncWithLocation = () => setView(readView())
    window.addEventListener('hashchange', syncWithLocation)
    window.addEventListener('popstate', syncWithLocation)
    return () => {
      window.removeEventListener('hashchange', syncWithLocation)
      window.removeEventListener('popstate', syncWithLocation)
    }
  }, [])

  const navigate = useCallback((nextView: View) => {
    const hash = nextView === 'home' ? '' : `#${nextView}`
    const nextUrl = `${window.location.pathname}${window.location.search}${hash}`
    window.history.pushState(null, '', nextUrl)
    setView(nextView)
  }, [])

  return { view, navigate }
}

import { useCallback, useMemo, useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  const mediaQuery = useMemo(
    () => typeof window === 'undefined' ? null : window.matchMedia(query),
    [query],
  )
  const subscribe = useCallback((onChange: () => void) => {
    mediaQuery?.addEventListener('change', onChange)
    return () => mediaQuery?.removeEventListener('change', onChange)
  }, [mediaQuery])
  const getSnapshot = useCallback(() => mediaQuery?.matches ?? false, [mediaQuery])

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false,
  )
}

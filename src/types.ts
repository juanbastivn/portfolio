export type Lang = 'es' | 'en'
export type ContentSection = 'software' | 'printing3d' | 'media'
export type View = 'home' | 'games' | ContentSection

export const isContentSection = (view: View): view is ContentSection =>
  view === 'software' || view === 'printing3d' || view === 'media'

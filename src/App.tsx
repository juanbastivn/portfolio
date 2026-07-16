import { lazy, Suspense, useState } from 'react'
import XMBWaveBackground from './components/XMBWaveBackground'
import SectionButton from './components/SectionButton'
import icon3d from './assets/icon_3d.png'
import iconMail from './assets/icon_mail.png'
import iconSw from './assets/icon_sw.png'
import iconGame from './assets/icon_game.png'
import iconMedia from './assets/icon_media.png'
import iconCircle from './assets/icon_circle.png'
import profilePic from './assets/profile_pic.jpg'

import { TbHome, TbBrandLinkedin, TbBrandGithub, TbFileCv, TbClock, TbDeviceGamepad, TbMail } from "react-icons/tb";

import SmallCardButton from './components/SmallCardButton'
import LargeCardButton from './components/LargeCardButton'
import RoundedCard from './components/RoundedCard'
import cvPdf from './assets/cv_es.pdf'
import { useClock } from './hooks/useClock'
import { useMediaQuery } from './hooks/useMediaQuery'
import { useViewNavigation } from './hooks/useViewNavigation'
import { isContentSection, type Lang, type View } from './types'
import './App.css'

const MOBILE_BREAKPOINT = 1024
const BlogView = lazy(() => import('./components/BlogView'))
const GamesView = lazy(() => import('./components/GamesView'))

// ─────────────────────────────────────────────────────────────────────────────
// XMB Wave Background — edit these values to customise the animation.
// ─────────────────────────────────────────────────────────────────────────────
const WAVE_COLOR        = '#43ffa1'  // hex colour of the waves
const SPEED_MULTIPLIER  = 1.0        // 0.5 = half speed, 2.0 = double speed
const BACKGROUND_COLOR  = '#002412'  // page background colour
const LIGHT_MODE        = false      // true = invert colours for a light bg
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Links — update these with your actual URLs / email.
// ─────────────────────────────────────────────────────────────────────────────
const LINKS = {
  linkedin: 'https://linkedin.com/in/juan-bastian/',
  github:   'https://github.com/juanbastivn',
  cv:       cvPdf,
  email:    'jbastian@gmail.com',
}
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Translations — edit strings here to localise the UI.
// ─────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS: Record<Lang, {
  welcome: string; score: string; aboutTitle: string; aboutText: string
  home: string; games: string; printing3d: string
  inDevelopment: string; comingSoon: string
}> = {
  es: {
    welcome: 'Bienvenido', score: 'Puntaje', aboutTitle: 'Sobre mí',
    aboutText: 'Ingeniero Civil en Computación (U. de Chile), desarrollador Fullstack especializado en arquitectura de servicios en producción. Diseño e implemento sistemas completos — desde la base de datos hasta la app móvil o web — con productos activos en App Store y Google Play. Experiencia liderando equipos técnicos y tomando decisiones de arquitectura de extremo a extremo.',
    home: 'Inicio', games: 'Juegos', printing3d: 'Impresión 3D',
    inDevelopment: 'En desarrollo', comingSoon: 'Próximamente',
  },
  en: {
    welcome: 'Welcome', score: 'Score', aboutTitle: 'About me',
    aboutText: 'Computer Science Engineer (Universidad de Chile), Fullstack developer focused on building and shipping production-ready services. I design complete systems end-to-end — from database to mobile app or web — with active products on the App Store and Google Play. Experienced in leading technical teams and making architecture decisions across the full stack.',
    home: 'Home', games: 'Games', printing3d: '3D printing',
    inDevelopment: 'In development', comingSoon: 'Coming soon',
  },
}
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT}px)`)
  const currentTime = useClock()
  const { view, navigate } = useViewNavigation()
  const [gameScore, setGameScore] = useState(0);
  const [lang, setLang] = useState<Lang>('es')
  const t = TRANSLATIONS[lang]
  const visibleView: View = isMobile && view === 'games' ? 'home' : view

  const langToggle = (
    <button className="lang-toggle glow-border" onClick={() => setLang(l => l === 'es' ? 'en' : 'es')}>
      {lang === 'es' ? 'EN' : 'ES'}
    </button>
  )

  return (
    <>
      <XMBWaveBackground
        waveColor={WAVE_COLOR}
        speedMultiplier={SPEED_MULTIPLIER}
        backgroundColor={BACKGROUND_COLOR}
        lightMode={LIGHT_MODE}
      />

      {isMobile ? (
        /* ════════════════════════════════════════════════════════════════════ */
        /*  Mobile / Tablet layout                                            */
        /* ════════════════════════════════════════════════════════════════════ */
        visibleView !== 'home' ? (
          <div className="mobile-root">
            <div className="card mobile-content-section">
              {isContentSection(visibleView) && (
                <Suspense fallback={<p className="view-loading">{lang === 'en' ? 'Loading…' : 'Cargando…'}</p>}>
                  <BlogView key={visibleView} section={visibleView} onBack={() => navigate('home')} lang={lang} />
                </Suspense>
              )}
            </div>
          </div>
        ) : (
          <div className="mobile-root">
            {/* Profile */}
            <div className="mobile-profile">
              <img className='profile-pic glow-border' src={profilePic} alt="Juan Bastián Espinoza Caimanque" />
              <p className='text-l'>Juan-Bastián</p>
            </div>

            {/* Nav buttons */}
            <div className="mobile-nav">
              <SectionButton icon={TbBrandLinkedin} label="LinkedIn" href={LINKS.linkedin} />
              <SectionButton icon={TbBrandGithub} label="GitHub" href={LINKS.github} />
              <SectionButton icon={TbFileCv} label="CV" href={LINKS.cv} />
              <SectionButton icon={TbMail} label="Email" onClick={() => window.open(`mailto:${LINKS.email}`)} />
            </div>

            {/* About */}
            <div className="mobile-about glow-border">
              <p className='text-e'>{t.aboutTitle}</p>
              <p className='text-m'>{t.aboutText}</p>
            </div>

            {/* Actions */}
            <div className="mobile-actions">
              <LargeCardButton image={iconSw} label="Software" onClick={() => navigate('software')} />
              <LargeCardButton image={icon3d} label={t.printing3d} onClick={() => navigate('printing3d')} />
              <LargeCardButton image={iconMedia} label={t.inDevelopment} onClick={() => null} />
            </div>

            {/* Footer */}
            <div className="mobile-footer">
              {langToggle}
            </div>
          </div>
        )
      ) : (
        /* ════════════════════════════════════════════════════════════════════ */
        /*  Desktop layout                                                    */
        /* ════════════════════════════════════════════════════════════════════ */
        <div className="content">
          <div className="card left-section">

            <img className='profile-pic glow-border' src={profilePic} alt="Juan Bastián Espinoza Caimanque - Ingeniero Civil en Computación" />
            <p className='text-l'>Juan-Bastián</p>

            <SectionButton icon={TbHome} label={t.home} onClick={() => navigate('home')} />
            <SectionButton icon={TbBrandLinkedin} label="LinkedIn" href={LINKS.linkedin} />
            <SectionButton icon={TbBrandGithub} label="GitHub" href={LINKS.github} />
            <SectionButton icon={TbFileCv} label="CV" href={LINKS.cv} />

            <div className="separator" />

            <div className="small-card-buttons">
              <SmallCardButton image={iconMail} label="Email" onClick={() => window.open(`mailto:${LINKS.email}`)} />
              <SmallCardButton image={iconGame} label={t.games} onClick={() => navigate('games')} />
            </div>
            {langToggle}

          </div>

          <div className="card right-section">
            {visibleView === 'home' ? (
              <div key="home" className="home-view">
                <div className="card-header">
                  <RoundedCard label={currentTime} icon={TbClock} numeric />
                  <h1 className='text-xl'>{t.welcome}</h1>
                  <RoundedCard label={`${t.score}: ${gameScore}`} icon={TbDeviceGamepad} />
                </div>

                <div className="separator" />

                <div className="card-text-content">
                  <img className='card-image' src={iconCircle} alt="Card Image" />
                  <div className='text-container glow-border'>
                    <p className='text-e'>{t.aboutTitle}</p>
                    <p className='text-m'>{t.aboutText}</p>
                  </div>
                </div>

                <div className="separator" />

                <div className="large-card-buttons">
                  <LargeCardButton image={iconSw} label="Software" onClick={() => navigate('software')} />
                  <LargeCardButton image={icon3d} label={t.printing3d} onClick={() => navigate('printing3d')} />
                  <LargeCardButton image={iconMedia} label={t.inDevelopment} onClick={() => null} />
                </div>
                <div className="separator" />

              </div>
            ) : visibleView === 'games' ? (
              <Suspense fallback={<p className="view-loading">{lang === 'en' ? 'Loading game…' : 'Cargando juego…'}</p>}>
                <GamesView onBack={() => navigate('home')} onScore={setGameScore} lang={lang} />
              </Suspense>
            ) : (
              <Suspense fallback={<p className="view-loading">{lang === 'en' ? 'Loading…' : 'Cargando…'}</p>}>
                <BlogView key={visibleView} section={visibleView} onBack={() => navigate('home')} lang={lang} />
              </Suspense>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default App

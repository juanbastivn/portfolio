import { useState, useEffect } from 'react'
import underConstructionGif from './assets/under_construcion.gif'
import XMBWaveBackground from './components/XMBWaveBackground'
import SectionButton from './components/SectionButton'
import iconMedia from './assets/icon_media.png'
import iconFolder from './assets/icon_folder.png'
import iconMail from './assets/icon_mail.png'
import iconSw from './assets/icon_sw.png'
import iconGame from './assets/icon_game.png'
import iconCircle from './assets/icon_circle.png'
import profilePic from './assets/profile_pic.jpg'

import { TbHome, TbBrandLinkedin, TbBrandGithub, TbFileCv   } from "react-icons/tb";

import SmallCardButton from './components/SmallCardButton'
import LargeCardButton from './components/LargeCardButton'
import RoundedCard from './components/RoundedCard'
import BlogView from './components/BlogView'
import GamesView from './components/GamesView'
import CustomCursor from './components/CustomCursor'
import cvPdf from './assets/cv_es.pdf'
import './App.css'

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

function App() {
  const [currentTime, setCurrentTime] = useState(() =>
    new Date().toLocaleTimeString('en-GB', { hour12: false })
  );

  const [view, setView] = useState<'home' | 'software' | 'media' | 'games'>('home');
  const [gameScore, setGameScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('es-CL', { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CustomCursor />
      <XMBWaveBackground
        waveColor={WAVE_COLOR}
        speedMultiplier={SPEED_MULTIPLIER}
        backgroundColor={BACKGROUND_COLOR}
        lightMode={LIGHT_MODE}
      />

      <div className="content">
        <div className="card left-section">
          
          <img className='profile-pic glow-border' src={profilePic} alt="Juan-Bastián" />
          <p className='text-l'>Juan-Bastián</p>

          <SectionButton icon={TbHome} label="Inicio" onClick={() => setView('home')} />
          <SectionButton icon={TbBrandLinkedin} label="LinkedIn" href={LINKS.linkedin} />
          <SectionButton icon={TbBrandGithub} label="GitHub" href={LINKS.github} />
          <SectionButton icon={TbFileCv} label="CV" href={LINKS.cv} />

          <div className="separator" />

          <div className="small-card-buttons">
            <SmallCardButton image={iconMail} onClick={() => window.open(`mailto:${LINKS.email}`)} />
            <SmallCardButton image={iconGame} onClick={() => setView('games')} />
          </div>

        </div>

        <div className="card right-section">
          {view === 'home' ? (
            <div key="home" className="home-view">
              <div className="card-header">
                <RoundedCard label={currentTime} />
                <p className='text-xl'>Bienvenido</p>
                <RoundedCard label={`Puntaje: ${gameScore}`} />
              </div>

              <div className="separator" />

              <div className="card-text-content">
                <img className='card-image' src={iconCircle} alt="Card Image" />
                <div className='text-container glow-border'>
                  <p className='text-e'>Sobre mí</p>
                  <p className='text-m'>Ingeniero Civil en Computación (U. de Chile), especialista en desarrollo Fullstack y Mobile. Trabajo con <strong>TypeScript</strong> (React Native, Angular, NestJS) y <strong>Flutter</strong>, liderando productos activos en App Store y Google Play. Experiencia en integración IoT, arquitecturas escalables y gestión de equipos técnicos.</p>
                </div>
              </div>

              <div className="separator" />

              <div className="large-card-buttons">
                <LargeCardButton image={iconSw} label="Software" onClick={() => setView('software')} />
                <LargeCardButton image={iconFolder} label="En desarrollo..." onClick={() => null} />
              </div>
              <div className="separator" />

            </div>
          ) : view === 'games' ? (
            <GamesView onBack={() => setView('home')} onScore={setGameScore} initialScore={gameScore} />
          ) : (
            <BlogView key={view} section={view as 'software' | 'media'} onBack={() => setView('home')} />
          )}
        </div>
      </div>
      {/* <div className="App">
        <h1>Under Construction</h1>
        <img src={underConstructionGif} alt="Under Construction" />
      </div> */}
    </>
  )
}

export default App

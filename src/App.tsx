import underConstructionGif from './assets/under_construcion.gif'
import XMBWaveBackground from './components/XMBWaveBackground'
import './App.css'

// ─────────────────────────────────────────────────────────────────────────────
// XMB Wave Background — edit these values to customise the animation.
// ─────────────────────────────────────────────────────────────────────────────
const WAVE_COLOR        = '#43ffa1'  // hex colour of the waves
const SPEED_MULTIPLIER  = 1.0        // 0.5 = half speed, 2.0 = double speed
const BACKGROUND_COLOR  = '#002412'  // page background colour
const LIGHT_MODE        = false      // true = invert colours for a light bg
// ─────────────────────────────────────────────────────────────────────────────

function App() {
  return (
    <>
      <XMBWaveBackground
        waveColor={WAVE_COLOR}
        speedMultiplier={SPEED_MULTIPLIER}
        backgroundColor={BACKGROUND_COLOR}
        lightMode={LIGHT_MODE}
      />

      {/* <div className="App">
        <h1>Under Construction</h1>
        <img src={underConstructionGif} alt="Under Construction" />
      </div> */}
    </>
  )
}

export default App

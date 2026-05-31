import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Demo.css'

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

export default function Demo() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const handleSkip = () => { window.location.href = '/arjs/index.html' }

  return (
    <div className="demo">
      <header className="demo-header">
        <img
          src="/logo.webp"
          alt="NUS Built Environment"
          className="demo-header-logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
        <span className="demo-step">01 / 01</span>
      </header>

      <Step1 onNext={handleSkip} onBack={() => navigate('/')} onSkip={handleSkip} />

    </div>
  )
}

function Step1({ onNext, onBack, onSkip }) {
  return (
    <main className="demo-main" style={isIOS ? {} : { paddingBottom: '70px' }}>
      <div className="demo-label-row">
        <p className="demo-section-label">BEFORE YOU START</p>
      </div>

      <div className="demo-tip">
        <img src="/demo-portrait.webp" alt="Portrait mode" className="demo-tip-img demo-tip-img--portrait" />
        <p className="demo-tip-caption">
          Point your camera at the ArUco markers on the physical model — works in portrait mode
        </p>
      </div>

      <div className="demo-tip">
        <img src="/demo-landscape.webp" alt="Landscape mode" className="demo-tip-img landscape" />
        <p className="demo-tip-caption">
          Rotate your phone for a wider view — landscape orientation is fully supported
        </p>
      </div>

      <div className="demo-warning">
        <img src="/demo-lowpower.webp" alt="Low power mode warning" className="demo-warning-img" />
        <div>
          <p className="demo-warning-title">DISABLE LOW POWER MODE</p>
          <p className="demo-warning-text">
            Low Power Mode restricts camera access on iOS and will break the AR experience. Turn it off in Settings before launching.
          </p>
        </div>
      </div>

      <div className="demo-spacer" />

      <div className={`demo-nav-row${isIOS ? '' : ' demo-nav-row--fixed'}`}>
        <button className="demo-nav-btn demo-nav-btn--back" onClick={onBack}>← BACK</button>
        <button className="demo-nav-btn demo-nav-btn--next" onClick={onNext}>START AR →</button>
      </div>
    </main>
  )
}

const ANNOTATIONS = [
  {
    id: 'back',
    top: '2.0%', left: '18.1%',
    title: 'Back Button',
    desc: 'Return to the home screen.',
  },
  {
    id: 'panel',
    top: '14.2%', left: '75.1%',
    title: 'Energy Use & EUI Panel',
    desc: 'Energy Use shows the annual breakdown by cooling, equipment, and lighting. Monthly EUI (Energy Use Intensity) charts all 12 months to show how energy efficiency varies across the year.',
  },
  {
    id: 'desc',
    top: '54.9%', left: '9.7%',
    title: 'Building Description & Audio',
    desc: 'Read the building caption to understand its design and sustainability features — then tap ▶ to listen to a recorded audio guide.',
  },
  {
    id: 'label',
    top: '38.3%', left: '77.3%',
    title: 'AR Building Label',
    desc: 'Tap any floating label to open its data panel. Tap the "Tap to close" label to close it.',
  },
  {
    id: 'maps',
    top: '92.1%', left: '77.8%',
    title: 'Google Maps Link',
    desc: 'Opens turn-by-turn directions to the building directly in Google Maps.',
  },
]

function Step2({ onBack, onSkip }) {
  const [active, setActive] = useState(null)
  const info = ANNOTATIONS.find(a => a.id === active)

  return (
    <main className="demo-main demo-main--p2">
      <div className="demo-label-row demo-label-row--p2">
        <p className="demo-section-label">WHAT YOU'LL SEE</p>
        <button className="demo-skip-box" onClick={onSkip}>SKIP →</button>
      </div>

      <div
        className="demo-annotated"
        onClick={() => setActive(null)}
      >
        <img src="/demo-ar.webp" alt="AR experience demo" className="demo-ar-img" />

        {ANNOTATIONS.map(a => (
          <button
            key={a.id}
            className={`anno-dot${active === a.id ? ' anno-dot--active' : ''}`}
            style={{ top: a.top, left: a.left }}
            onClick={e => { e.stopPropagation(); setActive(prev => prev === a.id ? null : a.id) }}
            aria-label={a.title}
          />
        ))}
      </div>

      <div className={`anno-info${info ? ' anno-info--visible' : ''}`}>
        {info ? (
          <>
            <p className="anno-info-title">{info.title}</p>
            <p className="anno-info-desc">{info.desc}</p>
          </>
        ) : (
          <p className="anno-info-hint">Tap the <span className="anno-hint-dot" /> dots to learn more</p>
        )}
      </div>

      <div className="demo-nav-row">
        <button className="demo-nav-btn demo-nav-btn--back" onClick={onBack}>← BACK</button>
        <button className="demo-nav-btn demo-nav-btn--start" onClick={onSkip}>START AR →</button>
      </div>
    </main>
  )
}

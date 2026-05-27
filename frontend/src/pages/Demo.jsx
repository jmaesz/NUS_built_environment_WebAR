import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Demo.css'

export default function Demo() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()

  return (
    <div className="demo">
      <header className="demo-header">
        <img
          src="/logo.png"
          alt="NUS Built Environment"
          className="demo-header-logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
        <span className="demo-step">0{step} / 02</span>
      </header>

      {step === 1
        ? <Step1 onNext={() => setStep(2)} />
        : <Step2 />
      }

      <footer className="demo-footer">
        <span>NUSCAPE-AR</span>
        <span className="demo-footer-line" />
        <span>NUS BUILT ENVIRONMENT</span>
      </footer>
    </div>
  )
}

function Step1({ onNext }) {
  return (
    <main className="demo-main">
      <p className="demo-section-label">BEFORE YOU START</p>

      <div className="demo-tip">
        <img src="/demo-portrait.png" alt="Portrait mode" className="demo-tip-img" />
        <p className="demo-tip-caption">
          Point your camera at the ArUco markers on the physical model — works in portrait mode
        </p>
      </div>

      <div className="demo-tip">
        <img src="/demo-landscape.png" alt="Landscape mode" className="demo-tip-img landscape" />
        <p className="demo-tip-caption">
          Rotate your phone for a wider view — landscape orientation is fully supported
        </p>
      </div>

      <div className="demo-warning">
        <img src="/demo-lowpower.png" alt="Low power mode warning" className="demo-warning-img" />
        <div>
          <p className="demo-warning-title">DISABLE LOW POWER MODE</p>
          <p className="demo-warning-text">
            Low Power Mode restricts camera access on iOS and will break the AR experience. Turn it off in Settings before launching.
          </p>
        </div>
      </div>

      <div className="demo-spacer" />

      <button className="demo-cta" onClick={onNext}>
        NEXT
        <span className="demo-cta-arrow">→</span>
      </button>
    </main>
  )
}

const ANNOTATIONS = [
  { label: 'Back to home',           top: '3%',  left: '2%'  },
  { label: 'Energy & architect data', top: '3%',  right: '2%' },
  { label: 'Building description',   top: '38%', left: '2%'  },
  { label: 'AR label — tap to open', top: '52%', right: '2%' },
  { label: 'Open in Google Maps',    top: '79%', left: '2%'  },
]

function Step2() {
  return (
    <main className="demo-main demo-main--p2">
      <p className="demo-section-label demo-section-label--padded">WHAT YOU'LL SEE</p>

      <div className="demo-annotated">
        <img src="/demo-ar.png" alt="AR experience demo" className="demo-ar-img" />
        {ANNOTATIONS.map((a, i) => (
          <span
            key={i}
            className="demo-anno"
            style={{ top: a.top, left: a.left, right: a.right }}
          >
            {a.label}
          </span>
        ))}
      </div>

      <div className="demo-spacer" />

      <button className="demo-cta demo-cta--padded" onClick={() => { window.location.href = '/arjs/index.html' }}>
        START AR
        <span className="demo-cta-arrow">→</span>
      </button>
    </main>
  )
}

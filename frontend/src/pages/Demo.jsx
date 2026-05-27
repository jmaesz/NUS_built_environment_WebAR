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
        ? <Step1 onBack={() => navigate('/')} onNext={() => setStep(2)} />
        : <Step2 onBack={() => setStep(1)} />
      }

      <footer className="demo-footer">
        <span>NUSCAPE-AR</span>
        <span className="demo-footer-line" />
        <span>NUS BUILT ENVIRONMENT</span>
      </footer>
    </div>
  )
}

function Step1({ onBack, onNext }) {
  return (
    <main className="demo-main">
      <p className="demo-section-label">BEFORE YOU START</p>

      <div className="demo-tips-grid">
        <div className="demo-tip">
          <img src="/demo-portrait.png" alt="Portrait mode" className="demo-tip-img" />
          <p className="demo-tip-caption">
            Point your camera at the ArUco markers on the physical model — works in portrait mode
          </p>
        </div>
        <div className="demo-tip">
          <img src="/demo-landscape.png" alt="Landscape mode" className="demo-tip-img" />
          <p className="demo-tip-caption">
            Rotate your phone for a wider view — landscape mode is fully supported too
          </p>
        </div>
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

function Step2({ onBack }) {
  return (
    <main className="demo-main">
      <p className="demo-section-label">WHAT YOU'LL SEE</p>

      <img src="/demo-ar.png" alt="AR experience demo" className="demo-ar-img" />

      <div className="demo-desc-block">
        <p className="demo-desc">
          Tap any building label to reveal its energy breakdown, monthly usage chart, building description, and a direct link to Google Maps.
        </p>
      </div>

      <div className="demo-spacer" />

      <button className="demo-cta" onClick={() => { window.location.href = '/arjs/index.html' }}>
        START AR
        <span className="demo-cta-arrow">→</span>
      </button>
    </main>
  )
}
